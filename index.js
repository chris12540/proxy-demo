const express = require('express')
const axios = require('axios')





// YOUR AXIOS CALLS WILL NOT WORK IF YOU DON'T HAVE A PROXY RUNNING HERE.
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

const PORT = 4000
app.listen(PORT, () => {
  console.log('Server listening on port ' + PORT);
})
