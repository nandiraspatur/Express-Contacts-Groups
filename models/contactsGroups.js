var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./databases/database.db');

class ContactsGroups {
  constructor(data) {
    this.id = data.id;
    this.contact_id = data.contact_id
    this.group_id = data.group_id
  }

  static findAll(){
    let promiseObj = new Promise((resolve, reject) => {
      db.all('SELECT * FROM ContactsGroups', (err, rows) =>{
        let result = []
        rows.forEach((data) => {
          let contacts = new ContactsGroups(data)
          result.push(contacts);
        })
        resolve(result)
      })
    })
    return promiseObj
  }

  static insertCG(contact_id, group_id){
    db.run(`INSERT INTO ContactsGroups (contact_id, group_id) VALUES ('${contact_id}', '${group_id}')`)
  }

  // static editContactsGroupsGet(paramsId){
  //   let promiseObj = new Promise((resolve, reject) => {
  //     db.get(`SELECT * FROM ContactsGroups WHERE id = '${paramsId}'`, function(err, rows){
  //       let contacts = new ContactsGroups(rows)
  //       resolve(contacts);
  //     })
  //   })
  //   return promiseObj
  // }
  //
  // static editContactsGroupsPost(inputParams, name, company, telp_number, email){
  //   db.run(`UPDATE ContactsGroups SET name='${name}', company='${company}', telp_number='${telp_number}', email='${email}' WHERE id='${inputParams}'`)
  // }

  static deleteCG(inputParams){
    db.run(`DELETE FROM sqlite_sequence WHERE name='ContactsGroups'`)
    db.run(`DELETE FROM ContactsGroups WHERE contact_id='${inputParams}'`)
  }
}

module.exports = ContactsGroups;
