require "JSONRatesAPIAccess"

class CurrencyQuoteController < ApplicationController
	include JSONRatesAPIAccess

	def index
	end

	def search
		respond_to do |format|
			format.json {render json: build_request(params[:currency], params[:start_date], params[:final_date])}
		end
	end
end
