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

	// this.jar = request.jar();


};


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
	return new Promise(function(resolve, reject) {

		var url = 'http://cb.is/statistics/offical-exchange-rate/';
		request({
			"url": url,
			"method": "POST",
			"form": {
				"ctl00$ctl00$Content$Content$ctl04$ddlDays": day,
				"ctl00$ctl00$Content$Content$ctl04$ddlMonths": month,
				"ctl00$ctl00$Content$Content$ctl04$ddlYears": year,
				"ctl00$ctl00$Content$Content$ctl04$btnGetGengi": "Search"
			},
			// "jar": that.jar,
			"headers": {
				'user-agent': 'ISK.js (http://github.com/andreassolberg) We love Iceland, and request your currency rates in peace.',
				'referer': url
			}
		}, function(error, response, body) {

			if (error) {
				return reject()
			}

			that.debugResponse(response, body);


			// console.log("status code ", response.statusCode);

			var $ = cheerio.load(body);


			var table = $('table.Gengistafla').eq(0);
			// var pb = $('#passordboks');
			// var msg = $('#main h2').text().trim();
			//
			// if (pb.length > 0) {
			// 	return reject(new Error('Feil brukernavn eller passord'));
			// } else if (v.length !== 1) {
			// 	return reject(new Error(msg));
			// }


			var data = {};
			// var tsnow = (new Date()).getTime();
			// var dr = /(\d{2})\/(\d{2})\/(\d{4})/;

			table.find('tr').each(function(i, elem) {

				if (i === 0) {
					// Skip header
					return
				}

				var e = $(this);
				// console.log("-------");
				// console.log();
				var key = e.find('td').eq(0).text();
				var x = {
					"buy": parseFloat(e.find('td').eq(1).text()) || null,
					"sell": parseFloat(e.find('td').eq(2).text()) || null,
					"mid": parseFloat(e.find('td').eq(3).text())
				};
				data[key] = x
			});

			return resolve(data);



		});


	});

}

exports.ISK = ISK
