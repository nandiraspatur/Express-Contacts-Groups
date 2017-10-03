//express
var express = require('express')
var app = express()

app.set('view engine', 'ejs')
app.use(express.static('./assets'))

//Routes
const index = require('./routers/index')
const contacts = require('./routers/contacts')
const groups = require('./routers/groups')
const profiles = require('./routers/profiles')
const addresses = require('./routers/addresses')

app.use('/', index)
app.use('/contacts', contacts)
app.use('/groups', groups)
app.use('/profiles', profiles)
app.use('/addresses', addresses)

app.listen(3000, (err) => {
  console.log('Listen port 3000');
});
