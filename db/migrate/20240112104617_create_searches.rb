# db/migrate/[timestamp]_create_searches.rb

class CreateSearches < ActiveRecord::Migration[6.0]
  def change
    create_table :searches do |t|
      t.string :query
      t.string :ip

      t.timestamps
    end

    add_index :searches, :query
  end
end
