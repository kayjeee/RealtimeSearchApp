# spec/models/user_spec.rb
require 'rails_helper'

RSpec.describe User, type: :model do
  it "is valid with valid attributes" do
    user = User.new(
      ip: "127.0.0.1"
    )
    expect(user).to be_valid
  end

  # Add more tests as needed
end
