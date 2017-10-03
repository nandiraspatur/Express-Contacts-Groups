const express = require('express')
const router = express.Router()

const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const addresses = require('../models/addresses')

function renderAlertAddress(req, res, errMsg){
  addresses.findAll((rows, rows2) => {
    res.render('addresses', {addresses:rows, contacts:rows2, title:'Addresses', alert:errMsg})
  })
}

router.get('/', (req, res) => {
  renderAlertAddress(req, res)
})

router.post('/', urlencodedParser, (req, res) => {
  if (!req.body) return res.send('input data error')
  if (!req.body.street || !req.body.city || !req.body.zipcode || !req.body.contact_id){
   renderAlertAddress(req, res, 'Silakan isi semua form dengan lengkap!!')
  }else{
    addresses.insertAddresses(req.body.street, req.body.city, req.body.zipcode, req.body.contact_id)
    res.redirect('/addresses')
  }
})

router.get('/edit/:id', (req, res) => {
  addresses.editAddressesGet(req.params.id, (rows, rows2) => {
    res.render('addresses-edit', {data: rows, contacts: rows2, title:'Addresses | Edit Data'})
  })
})

router.post('/edit/:id', urlencodedParser, (req, res) => {
  if (!req.body) return res.send('input data error')
  if (!req.body.street || !req.body.city || !req.body.zipcode){
    res.redirect(`/addresses/edit/${req.params.id}`)
  }else{
    addresses.editAddressesPost(req.params.id, req.body.street, req.body.city, req.body.zipcode, req.body.contact_id)
    res.redirect('/addresses')
  }
})

router.get('/delete/:id', urlencodedParser, (req, res) => {
  if (!req.body) return res.send('input data error')
  addresses.deleteAddresses(req.params.id)
  res.redirect('/addresses')
})

module.exports = router;
