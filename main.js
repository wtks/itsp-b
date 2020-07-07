const axios = require('axios');
const express = require('express');
const cors = require('cors')

const app = express();
app.use(cors());
app.use(express.static(__dirname + "/frontend/dist/"));
app.get("/t/:paperId([^/]*)", function(req, res){
	const paperId = req.params.paperId
	axios.get(`http://s2-public-api-prod.us-west-2.elasticbeanstalk.com/v1/paper/${paperId}`)
		.then(r => {
			res.status(200).json(r.data)
		})
		.catch(error => {
			res.status(error.response.status).end()
		})
})
app.listen(8080);
