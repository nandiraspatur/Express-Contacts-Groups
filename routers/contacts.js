const express = require('express')
const router = express.Router()

const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const contacts = require('../models/contacts')


function renderAlertContacts(req, res, errMsg){
  contacts.findAll((rowsContacts, rowsGroups) => {
    res.render('contacts', {contacts:rowsContacts, groups:rowsGroups, title:'Contacts', alert:errMsg})
  })
}

router.get('/', (req, res) => {
  renderAlertContacts(req, res, '')
})

router.post('/', urlencodedParser, (req, res) => {
  if (!req.body) return res.send('input data error')
  if (!req.body.name || !req.body.company || !req.body.telp_number || !req.body.email){
    renderAlertContacts(req, res, 'Silakan isi semua form dengan lengkap!!')
  }else{
    contacts.insertContact(req.body.name, req.body.company, req.body.telp_number, req.body.email)
    res.redirect('/contacts')
  }
})

router.get('/edit/:id', (req, res) => {
  contacts.editContactsGet(req.params.id, (rows) => {
    res.render('contacts-edit', {data: rows, title:'Contacts | Edit Data'})
  })
})

router.post('/edit/:id', urlencodedParser, (req, res) => {
  if (!req.body) return res.send('input data error')
  if (!req.body.name || !req.body.company || !req.body.telp_number || !req.body.email){
    res.redirect(`/contacts/edit/${req.params.id}`)
  }else{
    contacts.editContactsPost(req.params.id, req.body.name, req.body.company, req.body.telp_number, req.body.email)
    res.redirect(`/contacts`)
  }
})

router.get('/delete/:id', urlencodedParser, (req, res) => {
  if (!req.body) return res.send('input data error')
  contacts.deleteContact(req.params.id)
  res.redirect('/contacts')
})

function renderAlertConAdd(req, res, errMsg){
  contacts.findAddresses(req.params.id, (rows) => {
    res.render('addresses-with-contact', {addresses:rows, title:'Addresses', alert:errMsg})
  })
}

router.get('/address/:id', urlencodedParser, (req, res) => {
  renderAlertConAdd(req, res, '')
})

router.post('/address/:id', urlencodedParser, (req, res) => { // add address via addresses-with-contact
  console.log(req.body);
  console.log(req.params);
  if (!req.body) return res.send('input data error')
  if (!req.body.street || !req.body.city || !req.body.zipcode || !req.params.id){
    renderAlertConAdd(req, res, 'Silakan isi semua form dengan lengkap!!')
  }else{
    contacts.addAddressByContact(req.params.id, req.body.street, req.body.city, req.body.zipcode)
    res.redirect(`/contacts/address/${req.params.id}`)
  }
})

router.get('/address/delete/:id', urlencodedParser, (req, res) => {
  if (!req.body) return res.send('input data error')
  contacts.deleteAddressByContact(req.params.id)
  res.redirect('/contacts')
})

module.exports = router;
