require 'rails_helper'
require "TestConcern"

RSpec.describe "API Test" do
	before {@test = TestConcern.new}

	context "valid arguments" do
		it "should not find any error" do
			expect(@test.build_request("EUR", (Time.now - (60*60*24*2)).strftime("%F"), 
				Time.now.strftime("%F"))["error"].to_s).to be_empty
		end

		it "should return a rate for a specific date" do
			rate = @test.build_request("EUR", "2014-06-23","2014-06-28")["rates"].first[1]["rate"].to_f
			expect(rate).to eq(3.02169959)
		end
	end

	context "invalid arguments" do
		it "should get error when start date is a future date" do
			expect(@test.build_request("EUR", (Time.now + (60*60*24*2)).strftime("%F"), 
				Time.now.strftime("%F"))["error"].to_s).to_not be_empty
		end

		it "should get error when final date is less than start date" do
			expect(@test.build_request("EUR", (Time.now).strftime("%F"), 
				(Time.now - (60*60*24*2)).strftime("%F"))["error"].to_s).to_not be_empty
		end

		it "should return an incorrect rate for an unknown currency" do
			rate = @test.build_request("XYZ23", "2014-06-23","2014-06-28")["error"]
			expect(rate).to_not be_empty
		end
	end

end

