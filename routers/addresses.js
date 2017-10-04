const express = require('express')
const router = express.Router()

const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const addresses = require('../models/addresses')
const contacts = require('../models/contacts')

function renderAlertAddress(req, res, errMsg){
  Promise.all([
    addresses.findAll(),
    contacts.findAll()
  ]).then((rows) => {
    rows[0].forEach((address) => {
      rows[1].forEach((contacts) => {
        if(address.contact_id == contacts.id){
          address.name = contacts.name
        }
      })
    })
    res.render('addresses', {addresses:rows[0], contacts:rows[1], title:'Addresses', alert:errMsg})
  })
}

router.get('/', (req, res) => {
  renderAlertAddress(req, res)
})

router.post('/', urlencodedParser, (req, res) => {
  if (!req.body.street || !req.body.city || !req.body.zipcode || !req.body.contact_id){
   renderAlertAddress(req, res, 'Silakan isi semua form dengan lengkap!!')
  }else{
    addresses.insertAddresses(req.body.street, req.body.city, req.body.zipcode, req.body.contact_id)
    res.redirect('/addresses')
  }
})

router.get('/edit/:id', (req, res) => {
  Promise.all([
    addresses.editAddressesGet(req.params.id),
    contacts.findAll()
  ]).then((rows) => {
    res.render('addresses-edit', {data: rows[0], contacts: rows[1], title:'Addresses | Edit Data'})
  })
})

router.post('/edit/:id', urlencodedParser, (req, res) => {
  if (!req.body.street || !req.body.city || !req.body.zipcode){
    res.redirect(`/addresses/edit/${req.params.id}`)
  }else{
    addresses.editAddressesPost(req.params.id, req.body.street, req.body.city, req.body.zipcode, req.body.contact_id)
    res.redirect('/addresses')
  }
})

router.get('/delete/:id', urlencodedParser, (req, res) => {
  addresses.deleteAddresses(req.params.id)
  res.redirect('/addresses')
})

module.exports = router;
