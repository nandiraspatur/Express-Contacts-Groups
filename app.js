//express
var express = require('express')
var app = express()

//sqlite
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./databases/database.db');

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.set('view engine', 'ejs')
app.use(express.static('./assets'))

app.get('/', (req, res) => {
  res.render('index', {title:'Home Page'})
})

//Contacts----------------------
app.get('/contacts', (req, res) => {
  db.all('SELECT * FROM Contacts', (err, rows) =>{
    res.render('contacts', {contacts:rows, title:'Contacts'})
  })
})
app.post('/contacts', urlencodedParser, (req, res) => {
  if (!req.body) return res.send('input data error')
  if (!req.body.name || !req.body.company || !req.body.telp_number || !req.body.email){
    res.redirect('/contacts')
  }else{
    db.run(`INSERT INTO Contacts (name, company, telp_number, email) VALUES ('${req.body.name}', '${req.body.company}', '${req.body.telp_number}', '${req.body.email}')`, (err) => {
      if(!err) res.redirect('/contacts')
    })
  }
})
app.get('/contacts/edit/:id', (req, res) => {
  db.all(`SELECT * FROM Contacts WHERE id = '${req.params.id}'`, function(err, rows){
    res.render('contacts-edit', {data: rows[0], title:'Contacts | Edit Data'})
  })
})
app.post('/contacts/edit/:id', urlencodedParser, (req, res) => {
  if (!req.body) return res.send('input data error')
  if (!req.body.name || !req.body.company || !req.body.telp_number || !req.body.email){
    res.redirect(`/contacts/edit/${req.params.id}`)
  }else{
    db.run(`UPDATE Contacts SET name='${req.body.name}', company='${req.body.company}', telp_number='${req.body.telp_number}', email='${req.body.email}' WHERE id='${req.params.id}'`, (err) => {
      if(!err) res.redirect('/contacts')
    })
  }
})
app.get('/contacts/delete/:id', urlencodedParser, (req, res) => {
  if (!req.body) return res.send('input data error')
  db.run(`DELETE FROM sqlite_sequence WHERE name='Contacts'`)
  db.run(`DELETE FROM Contacts WHERE id='${req.params.id}'`)
  res.redirect('/contacts')
})


//Groups
app.get('/groups', (req, res) => {
  db.all('SELECT * FROM Groups', (err, rows) =>{
    res.render('groups', {groups:rows, title:'Groups'})
  })
})
app.post('/groups', urlencodedParser, (req, res) => {
  if (!req.body) return res.send('input data error')
  if (!req.body.name_of_group){
   res.redirect('/groups')
  }else{
   db.run(`INSERT INTO Groups (name_of_group) VALUES ('${req.body.name_of_group}')`, (err) => {
     if(!err) res.redirect('/groups')
   })
  }
})
app.get('/groups/edit/:id', (req, res) => {
  db.all(`SELECT * FROM Groups WHERE id = '${req.params.id}'`, function(err, rows){
    res.render('groups-edit', {data: rows[0], title:'Groups | Edit Data'})
  })
})
app.post('/groups/edit/:id', urlencodedParser, (req, res) => {
  if (!req.body) return res.send('input data error')
  if (!req.body.name_of_group){
    res.redirect(`/groups/edit/${req.params.id}`)
  }else{
    db.run(`UPDATE Groups SET name_of_group='${req.body.name_of_group}' WHERE id='${req.params.id}'`, (err) => {
      if(!err) res.redirect('/groups')
    })
  }
})
app.get('/groups/delete/:id', urlencodedParser, (req, res) => {
  if (!req.body) return res.send('input data error')
  db.run(`DELETE FROM sqlite_sequence WHERE name='Groups'`)
  db.run(`DELETE FROM Groups WHERE id='${req.params.id}'`)
  res.redirect('/groups')
})


// Profiles
function alert(req, res, errMsg){
  db.all('SELECT Profiles.*,Contacts.name FROM Profiles JOIN Contacts ON Profiles.contact_id = Contacts.id', (err, rows) =>{
    db.all('SELECT * FROM Contacts', (err, rows2) =>{
      res.render('profiles', {profiles:rows, contacts:rows2, title:'Profiles', alert:errMsg})
    })
  })
}

app.get('/profiles', (req, res) => {
  alert(req, res, '')
})
app.post('/profiles', urlencodedParser, (req, res) => {
  if (!req.body) return res.send('input data error')
  if (!req.body.username || !req.body.password || !req.body.contact_id){
   alert(req, res, 'Silakan isi semua form dengan lengkap!!')
  }else{
   db.run(`INSERT INTO Profiles (username, password, contact_id) VALUES ('${req.body.username}', '${req.body.password}', '${req.body.contact_id}')`, (err) => {
     if(!err){
       res.redirect('/profiles')
     }else{
       alert(req, res, 'Contact ID tidak bisa dipakai!!')
     }
   })
  }
})
app.get('/profiles/edit/:id', (req, res) => {
  db.all(`SELECT * FROM Profiles WHERE id = '${req.params.id}'`, function(err, rows){
    res.render('profiles-edit', {data: rows[0], title:'Profiles | Edit Data'})
  })
})
app.post('/profiles/edit/:id', urlencodedParser, (req, res) => {
  if (!req.body) return res.send('input data error')
  if (!req.body.username || !req.body.password){
    res.redirect(`/profiles/edit/${req.params.id}`)
  }else{
    db.run(`UPDATE Profiles SET username='${req.body.username}', password='${req.body.password}' WHERE id='${req.params.id}'`, (err) => {
      if(!err) res.redirect('/profiles')
    })
  }
})
app.get('/profiles/delete/:id', urlencodedParser, (req, res) => {
  if (!req.body) return res.send('input data error')
  db.run(`DELETE FROM sqlite_sequence WHERE name='Profiles'`)
  db.run(`DELETE FROM Profiles WHERE id='${req.params.id}'`)
  res.redirect('/profiles')
})


// Addresses
app.get('/addresses', (req, res) => {
  db.all('SELECT * FROM Addresses', (err, rows) =>{
    res.render('addresses', {addresses:rows, title:'Addresses'})
  })
})
app.post('/addresses', urlencodedParser, (req, res) => {
  if (!req.body) return res.send('input data error')
  if (!req.body.street || !req.body.city || !req.body.zipcode){
   res.redirect('/addresses')
  }else{
   db.run(`INSERT INTO Addresses (street, city, zipcode) VALUES ('${req.body.street}', '${req.body.city}', '${req.body.zipcode}')`, (err) => {
     if(!err) res.redirect('/addresses')
   })
  }
})
app.get('/addresses/edit/:id', (req, res) => {
  db.all(`SELECT * FROM Addresses WHERE id = '${req.params.id}'`, function(err, rows){
    res.render('addresses-edit', {data: rows[0], title:'Addresses | Edit Data'})
  })
})
app.post('/addresses/edit/:id', urlencodedParser, (req, res) => {
  if (!req.body) return res.send('input data error')
  if (!req.body.street || !req.body.city || !req.body.zipcode){
    res.redirect(`/addresses/edit/${req.params.id}`)
  }else{
    db.run(`UPDATE Addresses SET street='${req.body.street}', city='${req.body.city}', zipcode='${req.body.zipcode}' WHERE id='${req.params.id}'`, (err) => {
      if(!err) res.redirect('/addresses')
    })
  }
})
app.get('/addresses/delete/:id', urlencodedParser, (req, res) => {
  if (!req.body) return res.send('input data error')
  db.run(`DELETE FROM sqlite_sequence WHERE name='Addresses'`)
  db.run(`DELETE FROM Addresses WHERE id='${req.params.id}'`)
  res.redirect('/addresses')
})

app.listen(3000, (err) => {
  console.log('Listen port 3000');
});
