const express = require('express')
const axios = require('axios')
require('dotenv').config()
const yelp = require('yelp-fusion')
const ProxyAgent = require('https-proxy-agent')



// YOUR AXIOS CALLS WILL NOT WORK IF YOU DON'T HAVE A PROXY RUNNING HERE.
// Unless you comment this out.
axios.defaults.proxy = {
  host: '127.0.0.1',
  port: 8888
}

const app = express()
app.use(express.json())

app.get('/data', (req, res) => {
  const id = 1
  // const id = req.params.id
  axios.get('http://jsonplaceholder.typicode.com/users/' + id)
    .then(response => {
      res.json(response.data)
    })
    .catch(error => {
      console.error(error)
      res.status(500).json({
        message: 'An unexpected error occurred on the server'
      })
    })
})

// YOUR YELP CALLS WILL NOT WORK UNLESS YOU HAVE A PROXY RUNNING.
// Since it uses SSL, we use process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0.
// Do not do `process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0` in a production environment,
// it's just for debugging.
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
app.get('/yelp', (req, res) => {
  const yelpClient = yelp.client(process.env.YELP_APIKEY, {
    agent: new ProxyAgent('http://127.0.0.1:8888')
  })
  yelpClient.search({
    term:'Four Barrel Coffee',
    location: 'san francisco, ca'
  })
    .then(response => {
      res.json(response.jsonBody)
    })
    .catch(error => {
      console.error(error)
      res.status(500).json({
        message: 'An unexpected error occurred on the server'
      })
    })
})

const PORT = 4000
app.listen(PORT, () => {
  console.log('Server listening on port ' + PORT);
})
