const http = require("http");
const fs = require('fs');
const axios = require('axios');
const express = require('express');
const cors = require('cors')

const app = express();
app.use(cors());
app.use(express.static(__dirname + "/frontend/dist/"));
app.get("/t", function(req, res){
	axios.get('http://s2-public-api-prod.us-west-2.elasticbeanstalk.com/v1/paper/4be293210f1a0dc14cf002a0069cf61d494d7eb2')
		.then(r => {
			res.writeHead(200, { "Content-Type": "application/json charset=utf-8" })
			res.end(JSON.stringify(r.data))
		})
})
app.get("/t/:paperId([0-9a-f]{40})", function(req, res){
	const paperId = req.params.paperId
	axios.get(`http://s2-public-api-prod.us-west-2.elasticbeanstalk.com/v1/paper/${paperId}`)
		.then(r => {
			res.writeHead(200, { "Content-Type": "application/json charset=utf-8" })
			res.end(JSON.stringify(r.data))
		})
		.catch(error => {
			res.writeHead(error.response.status)
			res.end()
		})
})
app.get("/a", function(req, res){
	axios.get('http://s2-public-api-prod.us-west-2.elasticbeanstalk.com/v1/paper/0796f6cd7f0403a854d67d525e9b32af3b277331')
		.then(r => {
			res.writeHead(200, {"Content-Type": "application/json charset=utf-8"})
			const list = []
			r.data.references.forEach(v => {
				list.push(v.title)
			})
			res.end(JSON.stringify(list))
		})
})
app.get("/b", function(req, res){
	axios.get('http://s2-public-api-prod.us-west-2.elasticbeanstalk.com/v1/paper/0796f6cd7f0403a854d67d525e9b32af3b277331')
		.then(r => {
			res.writeHead(200, {"Content-Type": "application/json charset=utf-8"})
			const list = []
			r.data.citations.forEach(v => {
				list.push(v.title)
			})
			res.end(JSON.stringify(list))
		})
})
app.get(/.*/, function (req, res) {
	res.sendFile(__dirname + "/index.html")
});
app.listen(8080);
/*
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
		case "/t":
			axios.get('http://s2-public-api-prod.us-west-2.elasticbeanstalk.com/v1/paper/0796f6cd7f0403a854d67d525e9b32af3b277331')
				.then(r => {
					res.writeHead(200, { "Content-Type": "application/json charset=utf-8", "Access-Control-Allow-Origin" :"*" })
					res.end(JSON.stringify(r.data.title))
				})
			break
		case "/a":
			axios.get('http://s2-public-api-prod.us-west-2.elasticbeanstalk.com/v1/paper/0796f6cd7f0403a854d67d525e9b32af3b277331')
				.then(r => {
					res.writeHead(200, {"Content-Type": "application/json charset=utf-8", "Access-Control-Allow-Origin" :"*"})
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
					res.writeHead(200, {"Content-Type": "application/json charset=utf-8", "Access-Control-Allow-Origin" :"*"})
					const list = []
					r.data.citations.forEach(v => {
						list.push(v.title)
					})
					res.end(JSON.stringify(list))
				})
			break
	}
}).listen(80);
*/
