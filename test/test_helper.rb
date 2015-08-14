ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'
require 'minitest/autorun'
require 'minitest/reporters'
require 'ansi/code'
require 'shoulda'

class ActiveSupport::TestCase
  include FactoryGirl::Syntax::Methods
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all
  # Add more helper methods to be used by all tests here...
end

class ControllerTestCase < ActionController::TestCase
  include Devise::TestHelpers

  setup do
    @user = users(:kendall)
    sign_in @user
  end
end

module Minitest
  module Reporters
    class AwesomeReporter < ::Minitest::Reporters::BaseReporter
      include ANSI::Code
      include ::Minitest::RelativePosition

      def start
        super
        puts "Started"
        puts
      end

      def report
        super
        puts "Finished in %.5fs" % total_time
        print "\e[37m%d tests\e[0m" % count
        print ", "
        print_with_color :green, "%d passed", passes
        print ", "
        print_with_color :red, "%d failures", failures
        print ", "
        print_with_color :yellow, "%d errors", errors
        print ", "
        print_with_color :cyan, "%d skips", skips
        print ", "
        print "%d assertions" % assertions
        puts
      end

      def record(test)
        super
        print "    "
        print_colored_status(test)
        print(" (%.2fs) " % test.time)
        print test.name.gsub(/^test_: /, "")
        puts
        if !test.skipped? && test.failure
          print_info(test.failure)
          puts
        end
      end

      def print_colored_status(test)
        if test.passed?
          print(green { pad_mark( result(test).to_s.upcase ) })
        elsif test.skipped?
          print(cyan { pad_mark( result(test).to_s.upcase ) })
        elsif test.error?
          print(yellow { pad_mark( result(test).to_s.upcase ) })
        else
          print(red { pad_mark( result(test).to_s.upcase ) })
        end
      end

    protected

      def passes
        count - (failures + errors + skips)
      end

      def print_with_color(color, message, count)
        message = message % count
        message = send(color) { message } unless count.zero?
        print message
      end

      def before_suite(suite)
        puts "\e[4m#{suite}\e[0m"
      end

      def after_suite(suite)
        puts
      end

    end
  end
end

Minitest::Reporters.use! Minitest::Reporters::AwesomeReporter.new
