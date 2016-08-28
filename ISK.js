var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var querystring = require('querystring')



if (typeof String.prototype.startsWith !== 'function') {
	// see below for better implementation!
	String.prototype.startsWith = function(str) {
		return this.indexOf(str) === 0;
	};
}


var ISK = function(config) {
	this.jar = request.jar();
	this.state = null
}

ISK.prototype.fetchState = function() {
	var that = this;

	return new Promise(function(resolve, reject) {
		if (that.state !== null) {
			return resolve()
		}

		var url = 'http://cb.is/statistics/offical-exchange-rate/';
		// console.log("fetch state", url)
		request({
			"url": url,
			"method": "GET",
			"jar": that.jar,
			"headers": {
				'user-agent': 'ISK.js (http://github.com/andreassolberg) We love Iceland, and request your currency rates in peace.',
				'referer': url
			}
		}, function(error, response, body) {

			if (error) {
				return reject()
			}
			// that.debugResponse(response, body);
			var $ = cheerio.load(body);
			var data = {
				"__VIEWSTATEGENERATOR": $("input#__VIEWSTATEGENERATOR").attr("value"),
				"__VIEWSTATE": $("input#__VIEWSTATE").attr("value")
			}
			that.state = data
			// console.log("DAATA", data)

			return resolve();



		});
	})
}


ISK.prototype.debugResponse = function(res, body) {

	// console.log(Object.keys(res));
	console.log("HTTP " + res["method"] + ' ' + res.url);
	console.log(res.method);
	// console.log(res.headers);
	console.log("Status: " + res.statusCode + ' ' + res.statusMessage);
	if (res.headers.location) {
		console.log("Redirect to " + res.headers.location);
	}
	if (res.headers["set-cookie"]) {
		console.log("set cookie to " + res.headers["set-cookie"]);
	}
	console.log("---");
	console.log(body);
	console.log("---");


}


ISK.prototype.getData = function(year, month, day) {

	var that = this;
	return this.fetchState()
		.then(() => {
			// console.log("Year", year, "month", month, "day", day)
			var url = 'http://cb.is/statistics/offical-exchange-rate/';
			var form = {
				"ctl00$ctl00$Content$Content$ctl04$ddlDays": day,
				"ctl00$ctl00$Content$Content$ctl04$ddlMonths": month,
				"ctl00$ctl00$Content$Content$ctl04$ddlYears": year,
				"__VIEWSTATEGENERATOR": this.state["__VIEWSTATEGENERATOR"],
				"__VIEWSTATE": this.state["__VIEWSTATE"],
				"ctl00$ctl00$Content$Content$ctl04$btnGetGengi": "Search"
			}
			// console.log ("---- form", form)
			return new Promise(function(resolve, reject) {

				request({
					"url": url,
					"method": "POST",
					"form": form,
					"jar": that.jar,
					"headers": {
						'user-agent': 'ISK.js (http://github.com/andreassolberg) We love Iceland, and request your currency rates in peace.',
						'referer': url
					}
				}, function(error, response, body) {

					if (error) {
						return reject()
					}
					// that.debugResponse(response, body);
					var $ = cheerio.load(body);
					var table = $('table.Gengistafla').eq(0);
					var data = {};
					table.find('tr').each(function(i, elem) {

						if (i === 0) {
							// Skip header
							return
						}
						var e = $(this);
						var key = e.find('td').eq(0).text();
						var x = {
							"buy": parseFloat(e.find('td').eq(1).text()) || null,
							"sell": parseFloat(e.find('td').eq(2).text()) || null,
							"mid": parseFloat(e.find('td').eq(3).text())
						};
						data[key] = x
					});

					var dato = $("#ctl00_ctl00_Content_Content_ctl04_lblLastDate").text()
					// console.log("GOT DATO", dato)
					return resolve(data);
				})



			})



		});

}

exports.ISK = ISK
