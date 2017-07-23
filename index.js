const request = require("request")
const config = require("./config.json") //a config.json file that has the lametric data url and access token

const api_options = {
	method: 'POST',
	url: config.api_url,
	headers: {
		'cache-control': 'no-cache',
		'content-type': 'application/x-www-form-urlencoded',
		'accept': 'application/json, text/javascript, */*; q=0.01'
	},
	form: {
		'action': 'states_cost_data',
		'data[locL]': 'US',
		'data[locR]': 'US'
	}
}

const lametric_options = {
	method: 'POST',
	url: config.lametric.data_url,
	headers: {
		'cache-control': 'no-cache',
		'X-Access-Token': config.lametric.access_token,
		'accept': 'application/json'
	},
	json: true,
	body: {}
}

//get gas info from api url
request(api_options, function (error, response, body) {
	if(error){ console.log(error) }
	console.log(body)

	const parsed = body ? JSON.parse(body) : false

	//massage the data
	if(parsed && parsed.success){
		lametric_options.body.frames = [
			{"text": "AVG US gas prices","icon": "i11715", "index": 0},
			{"text": "$"+(parsed.data.unleaded[0].slice(0, -5)),"icon": "i11711", "index": 1},
			{"text": "$"+(parsed.data.midgrade[0].slice(0, -5)),"icon": "i11713", "index": 2},
			{"text": "$"+(parsed.data.premium[0].slice(0, -5)),"icon": "i11714", "index": 3},
			{"text": "$"+(parsed.data.diesel[0].slice(0, -5)),"icon": "i11221", "index": 4}
		]
		//send the request to lametric
		request(lametric_options, function(err2,resp2,body2){
			if(err2){ console.log(err2) }
			console.log(body2)
		})
	}
})
