# app/controllers/search_controller.rb

class SearchController < ApplicationController
  def search
    query = params[:query].to_s.strip
    log_search(query, request.remote_ip)
    render json: { status: 'success' }
  end

  def analytics
    @searches = Search.group(:query).count
  end

  private

  def log_search(query, ip)
    # Log the search query along with IP (e.g., save to a database)
    Search.create(query:, ip:)
  end
end
