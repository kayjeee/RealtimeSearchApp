# spec/models/search_spec.rb
require 'rails_helper'

RSpec.describe Search, type: :model do
  it 'is valid with valid attributes' do
    user = User.create(ip: '127.0.0.1')
    search = Search.new(query: 'Example Query', user:)
    expect(search).to be_valid
  end

  # Add more tests as needed
end
