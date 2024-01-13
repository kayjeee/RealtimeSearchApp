# db/migrate/xxxxxx_add_user_id_to_searches.rb
class AddUserIdToSearches < ActiveRecord::Migration[6.0]
  def change
    add_reference :searches, :user, foreign_key: true
  end
end
