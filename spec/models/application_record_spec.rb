# spec/models/application_record_spec.rb
require 'rails_helper'

RSpec.describe ApplicationRecord, type: :model do
  it "is a primary abstract class" do
    expect(described_class.abstract_class).to be_truthy
    expect(described_class.primary_abstract_class).to be_truthy
  end
end
