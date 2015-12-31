require 'open-uri'
require 'json'

module JSONRatesAPIAccess
	extend ActiveSupport::Concern
  	JSONRATES_BASE_URL = "http://jsonrates.com/historical/"
	def build_request(currency, start_date, final_date)
		stream = open(JSONRATES_BASE_URL + "?from=" + currency + "&to=BRL&dateStart=" + start_date + "&dateEnd=" + final_date)
		data = stream.read
		return JSON.parse(data)
	end
end