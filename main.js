const http = require("http");
const fs = require('fs');
const axios = require('axios');

const server = http.createServer(function (req, res) {
	switch (req.url) {
		case "/":
			let url =  "index.html";
			if (fs.existsSync(url)) {
				fs.readFile(url, (err, data) => {
					if (!err) {
						res.writeHead(200, {"Content-Type": "text/html"});
						res.end(data);
					} else {
						console.log(err);
					}
				});
			}
			break
		case "/a":
			axios.get('http://s2-public-api-prod.us-west-2.elasticbeanstalk.com/v1/paper/0796f6cd7f0403a854d67d525e9b32af3b277331')
				.then(r => {
					res.writeHead(200, {"Content-Type": "application/json charset=utf-8"})
					const list = []
					r.data.references.forEach(v => {
						list.push(v.title)
					})
					res.end(JSON.stringify(list))
				})
			break
		case "/b":
			axios.get('http://s2-public-api-prod.us-west-2.elasticbeanstalk.com/v1/paper/0796f6cd7f0403a854d67d525e9b32af3b277331')
				.then(r => {
					res.writeHead(200, {"Content-Type": "application/json charset=utf-8"})
					const list = []
					r.data.citations.forEach(v => {
						list.push(v.title)
					})
					res.end(JSON.stringify(list))
				})
			break
	}
}).listen(80);

