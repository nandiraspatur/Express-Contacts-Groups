const express = require('express')
const router = express.Router()

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const groups = require('../models/groups')
const contactsGroups = require('../models/contactsGroups')
const contacts = require('../models/contacts')

router.get('/', (req, res) => {
  Promise.all([
    groups.findAll(),
    contactsGroups.findAll(),
    contacts.findAll()
  ]).then((rows) => {
    rows[0].forEach((groups) => {
      groups.members = []
      rows[1].forEach((contactsGroups) => {
        rows[2].forEach((contacts) => {
          if(contacts.id == contactsGroups.contact_id && groups.id == contactsGroups.group_id){
            groups.members.push(contacts.name)
          }
        })
      })
    })
    res.render('groups', {groups:rows[0], title:'Groups'})
  })
})

router.post('/', urlencodedParser, (req, res) => {
  if (!req.body) return res.send('input data error')
  if (!req.body.name_of_group){
   res.redirect('/groups')
  }else{
   groups.insertGroups(req.body.name_of_group)
   res.redirect('/groups')
  }
})

router.get('/edit/:id', (req, res) => {
  groups.editGroupsGet(req.params.id).then((rows) => {
    res.render('groups-edit', {data: rows, title:'Groups | Edit Data'})
  })
})

router.post('/edit/:id', urlencodedParser, (req, res) => {
  if (!req.body) return res.send('input data error')
  if (!req.body.name_of_group){
    res.redirect(`/groups/edit/${req.params.id}`)
  }else{
    groups.editGroupsPost(req.params.id, req.body.name_of_group)
    res.redirect('/groups')
  }
})

router.get('/delete/:id', urlencodedParser, (req, res) => {
  groups.deleteGroups(req.params.id)
  res.redirect('/groups')
})

router.get('/assign-contacts/:id', (req, res) => {
  contacts.findAll().then((contactsRows) => {
    groups.editGroupsGet(req.params.id).then((groupsRows) => {
      res.render('assign-contact', {groups:groupsRows, contacts:contactsRows,title:'Group - Assign Data'})
    })
  })
})

router.post('/assign-contacts/:id', urlencodedParser, (req, res) => {
  contactsGroups.insertCG(req.body.contact_id, req.params.id)
  res.redirect('/groups')
})

module.exports = router;
