const express = require('express')
const router = express.Router()

const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const contacts = require('../models/contacts')
const groups = require('../models/groups')
const contactsGroups = require('../models/contactsGroups')


function renderAlertContacts(req, res, errMsg){
  Promise.all([
    contacts.findAll(),
    contactsGroups.findAll(),
    groups.findAll()
  ]).then((rows) => {
    rows[0].forEach((contacts) => {
      contacts.groups = []
      rows[1].forEach((contactsGroups) => {
        rows[2].forEach((groups) => {
          if(contacts.id == contactsGroups.contact_id && groups.id == contactsGroups.group_id){
            contacts.groups.push(groups.name_of_group)
          }
        })
      })
    })
    res.render('contacts', {contacts:rows[0], groups:rows[2], title:'Contacts', alert:errMsg})
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
    contacts.insertContact(req.body.name, req.body.company, req.body.telp_number, req.body.email, req.body.groups_id).then((contact_id) => {
      contactsGroups.insertCG(contact_id, req.body.groups_id)
    })
    res.redirect('/contacts')
  }
})

router.get('/edit/:id', (req, res) => {
  contacts.editContactsGet(req.params.id).then((rows) => {
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
  contactsGroups.deleteCG(req.params.id)
  res.redirect('/contacts')
})

function renderAlertConAdd(req, res, errMsg){
  Promise.all([
    contacts.findAddresses(req.params.id),
    contacts.findAll(req.params.id)
  ]).then((rows) => {
    rows[0].forEach((address) => {
      rows[1].forEach((contacts) => {
        if(address.contact_id == contacts.id){
          address.name = contacts.name
        }
      })
    })
    res.render('addresses-with-contact', {addresses:rows[0], params:req.params.id, title:'Addresses', alert:errMsg})
  })
}

router.get('/address/:id', urlencodedParser, (req, res) => {
  renderAlertConAdd(req, res, '')
})

router.post('/address/:id', urlencodedParser, (req, res) => {
  if (!req.body) return res.send('input data error')
  if (!req.body.street || !req.body.city || !req.body.zipcode || !req.params.id){
    renderAlertConAdd(req, res, 'Silakan isi semua form dengan lengkap!!')
  }else{
    contacts.addAddressByContact(req.params.id, req.body.street, req.body.city, req.body.zipcode, req.params.id)
    res.redirect(`/contacts/address/${req.params.id}`)
  }
})

router.get('/address/delete/:id', urlencodedParser, (req, res) => {
  if (!req.body) return res.send('input data error')
  contacts.deleteAddressByContact(req.params.id)
  res.redirect('/contacts')
})

module.exports = router;
