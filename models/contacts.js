var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./databases/database.db');

class Contacts {
  constructor(data) {
    this.id = data.id;
    this.name = data.name
    this.company = data.company
    this.telp_number = data.telp_number
    this.email = data.email
  }

  static findAll(){
    let promiseObj = new Promise((resolve, reject) => {
      db.all('SELECT * FROM Contacts', (err, rows) =>{
        let result = []
        rows.forEach((data) => {
          let contacts = new Contacts(data)
          result.push(contacts);
        })
        resolve(result)
      })
    })
    return promiseObj
  }

  static insertContact(name, company, telp_number, email, groupId){
    let promiseObj = new Promise((resolve, reject) => {
      db.run(`INSERT INTO Contacts (name, company, telp_number, email, group_id) VALUES ('${name}', '${company}', '${telp_number}', '${email}', '${groupId}')`, function(err) {
        if(!err){
          resolve(this.lastID)
        }
      })
    })
    return promiseObj
  }

  static editContactsGet(paramsId){
    let promiseObj = new Promise((resolve, reject) => {
      db.get(`SELECT * FROM Contacts WHERE id = '${paramsId}'`, function(err, rows){
        let contacts = new Contacts(rows)
        resolve(contacts);
      })
    })
    return promiseObj
  }

  static editContactsPost(inputParams, name, company, telp_number, email){
    db.run(`UPDATE Contacts SET name='${name}', company='${company}', telp_number='${telp_number}', email='${email}' WHERE id='${inputParams}'`)
  }

  static deleteContact(inputParams){
    db.run(`DELETE FROM sqlite_sequence WHERE name='Contacts'`)
    db.run(`DELETE FROM Contacts WHERE id='${inputParams}'`)
  }

  static findAddresses(paramsId){
    let promiseObj = new Promise((resolve, reject) => {
      db.all(`SELECT * FROM Addresses WHERE contact_id = '${paramsId}'`, (err, rows) =>{
        resolve(rows)
      })
    })
    return promiseObj
  }

  static addAddressByContact(inputParams, street, city, zipcode){
    db.run(`INSERT INTO Addresses (street, city, zipcode, contact_id) VALUES ('${street}', '${city}', '${zipcode}', '${inputParams}')`)
  }

  static deleteAddressByContact(inputParams){
    db.run(`DELETE FROM sqlite_sequence WHERE name='Addresses'`)
    db.run(`DELETE FROM Addresses WHERE id='${inputParams}'`)
  }
}

module.exports = Contacts;
