# app/controllers/search_controller.rb

class SearchController < ApplicationController
  def search
    query = params[:query].to_s.strip
    ip = request.remote_ip

    # Check if the same valid question has already been logged
    unless duplicate_entry?(query)
      log_search(query, ip)

      # Broadcast the search result
      ActionCable.server.broadcast('search_channel', { search_result: { ip: ip, query: query } })
    end

    # Log IP in the Rails logs
    Rails.logger.info("Search successful for IP: #{ip}, Query: #{query}")

    render json: { status: 'success', ip: ip } # Include IP in the response
  end

  def analytics
    @searches = Search.group(:query).count
    # You can log analytics or perform other actions based on @searches if needed
    Rails.logger.info("Search analytics: #{@searches}")
  end

  def user_logs
    # Retrieve all user log entries from the database
    @user_logs = Search.all
    render json: @user_logs
  end

  def trends
    # Fetch trends using the retrieve_trends method
    @trends = retrieve_trends
  end

  private

  def log_search(query, ip)
    # Log the search query along with IP (e.g., save to a database)
    Search.create(query: query, ip: ip)
  end

  def retrieve_trends
    trends = Search.group(:query).count
    # Select only the trends that have a count of 2 or more
    trending_questions = trends.select { |_query, count| count >= 2 }
    Rails.logger.info("Trends: #{trending_questions}")
    trending_questions
  end

  def duplicate_entry?(query)
    # Check for a duplicate entry with the same query
    Search.exists?(query: query)
  end
end
