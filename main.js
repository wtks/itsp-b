const http = require("http");
const fs = require('fs');

const server = http.createServer(function (req, res) {
	if (fs.existsSync("index.html")) {
		fs.readFile(url, (err, data) => {
			if (!err) {
				res.writeHead(200, {"Content-Type": "text/html"});
				res.end(data);
			} else {
				console.log(err);
			}
		});
	}
}).listen(80);
