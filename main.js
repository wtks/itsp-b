const axios = require('axios');
const express = require('express');
const cors = require('cors')

const app = express();
app.use(cors());
app.use(express.static(__dirname + "/frontend/dist/"));
app.get("/t/:paperId([^/]*)", function (req, res) {
	const paperId = req.params.paperId
	axios.get(`http://s2-public-api-prod.us-west-2.elasticbeanstalk.com/v1/paper/${paperId}`)
		.then(r => {
			res.set('Cache-Control', 'max-age=3600')
			res.status(200).json(r.data)
		})
		.catch(error => {
			res.status(error.response.status).end()
		})
})

// {title: str, authors: str, doi: str, year: str} のリストを返す
app.get("/s/:keyword", function (req, res) {
	const keyword = req.params.keyword
	const num = 10	// 最大件数
	axios.get(`https://dblp.org/search/publ/api?format=json&c=0&h=${num}&q=${keyword}`)
		.then(r => {
			const hitTotal = r.data.result.hits['@total']
			let papers
			if (hitTotal != 0) {
				papers = r.data.result.hits.hit
				papers = papers
					.filter(paper => {
						const doi = paper.info.doi
						return doi !== undefined
					})
					.map(paper => {
						const authors = paper.info.authors.author.map(v => v.text)
						return {
							title: paper.info.title,
							authors: authors,
							doi: paper.info.doi,
							year: paper.info.year
						}
					})
			}
			else papers = []

			res.set('Cache-Control', 'max-age=3600')
			res.status(200).json(papers)
		})
		.catch(error => {
			res.status(error.response.status).end()
		})
})
app.listen(8080);
