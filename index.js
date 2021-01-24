const express = require('express')
const bodyParser = require('body-parser')
const { Router } = require('express')
const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
  })



const db = require('./queries');

//router.get('/users/:id', db.getRecipe)
app.get('/listOfRecipe/:id', db.getListOfRecipes)
app.get('/listOfRecipe/', db.getListOfRecipes)
app.post('/update/:id', db.updateRecipe)
app.post('/create/:id', db.createNewRecipe)
app.post('/UpdateToPremium/:id', db.UpdateToPremium)
app.post('/UpdateToNonPremium/:id', db.UpdateToNonPremium)
app.post('/delete/:id', db.deleteRecipe)
app.post('/getRecipe/:id', db.getRecipe)


app.listen(port, () => {
console.log(`App running on port ${port}.`)
})