source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '3.2.2'

# Rails and Web Server
gem 'puma', '~> 5.0'
gem 'rails', '~> 7.0.7', '>= 7.0.7.2'

# Asset Pipeline
gem 'sprockets-rails'

# Database
gem 'pg', '~> 1.1'

# JavaScript and Frontend
gem 'importmap-rails'
gem 'jbuilder'
gem 'stimulus-rails'
gem 'turbo-rails'

# Background Jobs (if needed)
# gem 'sidekiq'

# Authentication and Authorization
gem 'cancancan'
gem 'devise'

# Testing
group :development, :test do
  gem 'capybara'
  gem 'rspec-rails'
  gem 'rubocop', '>= 1.0', '< 2.0'
  gem 'selenium-webdriver'
  gem 'web-console'
  gem 'webdrivers'
end

# Development and Debugging
group :development do
  gem 'bullet'
  # gem 'rack-mini-profiler'
  # gem 'spring'
  # gem 'sassc-rails'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: %i[mingw mswin x64_mingw jruby]

# Caching for Boot Time
gem 'bootsnap', require: false
