const express = require('express')
const router = express.Router()

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const groups = require('../models/groups')

router.get('/', (req, res) => {
  groups.findAll((rows) => {
    res.render('groups', {groups:rows, title:'Groups'})
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
  groups.editGroupsGet(req.params.id, (rows) => {
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

module.exports = router;
