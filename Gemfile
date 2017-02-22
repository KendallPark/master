source 'https://rubygems.org'


# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '4.2.2'
# Use postgresql as the database for Active Record
gem 'pg'
# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# See https://github.com/rails/execjs#readme for more supported runtimes
gem 'therubyracer', platforms: :ruby

# Use jquery as the JavaScript library
gem 'jquery-rails'

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.0'
# bundle exec rake doc:rails generates the API under doc/api.
gem 'sdoc', '~> 0.4.0', group: :doc

# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Unicorn as the app server
gem 'unicorn'

# Use Capistrano for deployment
gem 'capistrano-rails', group: :development

gem 'devise'
gem 'cancan'

gem 'sprockets', '~> 3.0'
gem 'sprockets-es6'
gem 'react-rails', '~> 1.0'
gem 'react-bootstrap-rails'

gem 'lodash-rails'

gem 'bootstrap-sass'
gem 'bootswatch-rails'
gem 'font-awesome-sass'

gem 'acts-as-taggable-on', '~> 3.4'

gem 'rails-api'

# images
gem 'paperclip'
gem 'aws-sdk', '< 2.0'

gem 'nokogiri'
gem 'fuzzy_match'

source 'https://rails-assets.org' do
  gem 'rails-assets-classnames'
  gem 'rails-assets-react-input-autosize'
  gem 'rails-assets-react-select'
  gem 'rails-assets-autosize'
  gem 'rails-assets-commonmark'
  gem 'rails-assets-xss-filters'
  gem 'rails-assets-remarkable'
end

group :test do
  gem "webmock", require: "webmock/minitest"
  gem 'shoulda'
  gem "capybara"
  gem "minitest"
  gem "rr"
  gem "minitest-reporters"
  gem 'factory_girl_rails'
  # gem 'faker'
end

group :production do
  gem 'rails_12factor'
end

group :development do
  gem "letter_opener"
  gem 'figaro'
end

group :development, :test do
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'pry'
  gem 'pry-rescue'
  gem 'pry-stack_explorer'
  gem 'factory-helper'
  gem 'rb-readline'
end
