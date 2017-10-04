const express = require('express')
const router = express.Router()

const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const profiles = require('../models/profiles')
const contacts = require('../models/contacts')

function renderAlertProfile(req, res, errMsg){
  Promise.all([
    profiles.findAll(),
    contacts.findAll()
  ]).then((rows) => {
    rows[0].forEach((profiles) => {
      rows[1].forEach((contacts) => {
        if(profiles.contact_id == contacts.id){
          profiles.name = contacts.name
        }
      })
    })
    res.render('profiles', {profiles:rows[0], contacts:rows[1], title:'Profiles', alert:errMsg})
  })
}

router.get('/', (req, res) => {
  renderAlertProfile(req, res, '')
})

router.post('/', urlencodedParser, (req, res) => {
  if (!req.body) return res.send('input data error')
  if (!req.body.username || !req.body.password || !req.body.contact_id){
    renderAlertProfile(req, res, 'Silakan isi semua form dengan lengkap!!')
  }else{
    profiles.insertProfile(req.body.username, req.body.password, req.body.contact_id).then((err) => {
      if(err){
        renderAlertProfile(req, res, 'Contact ID tidak bisa dipakai!!')
      }else{
        res.redirect('/profiles')
      }
    })
  }
})

router.get('/edit/:id', (req, res) => {
  profiles.editProfilesGet(req.params.id).then((rows) => {
    res.render('profiles-edit', {data: rows, title:'Profiles | Edit Data'})
  })
})

router.post('/edit/:id', urlencodedParser, (req, res) => {
  if (!req.body) return res.send('input data error')
  if (!req.body.username || !req.body.password){
    res.redirect(`/profiles/edit/${req.params.id}`)
  }else{
    profiles.editProfilesPost(req.params.id, req.body.username, req.body.password)
    res.redirect('/profiles')
  }
})

router.get('/delete/:id', urlencodedParser, (req, res) => {
  if (!req.body) return res.send('input data error')
  profiles.deleteProfiles(req.params.id)
  res.redirect('/profiles')
})

module.exports = router;
