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

  static findAll(cb){
    db.all('SELECT * FROM Contacts', (err, rowsContacts) =>{
      let contactsObj = []
      rowsContacts.forEach((data) => {
        let contacts = new Contacts(data)
        contactsObj.push(contacts);
      })
      db.all('SELECT * FROM Groups', (err, rowsGroups) =>{
        cb(contactsObj, rowsGroups)
      })
    })
  }

  static insertContact(name, company, telp_number, email){
    db.run(`INSERT INTO Contacts (name, company, telp_number, email) VALUES ('${name}', '${company}', '${telp_number}', '${email}')`)
  }

  static editContactsGet(input, cb){
    db.get(`SELECT * FROM Contacts WHERE id = '${input}'`, function(err, rows){
      let contacts = new Contacts(rows)
      cb(contacts);
    })
  }

  static editContactsPost(inputParams, name, company, telp_number, email){
    db.run(`UPDATE Contacts SET name='${name}', company='${company}', telp_number='${telp_number}', email='${email}' WHERE id='${inputParams}'`)
  }

  static deleteContact(inputParams){
    db.run(`DELETE FROM sqlite_sequence WHERE name='Contacts'`)
    db.run(`DELETE FROM Contacts WHERE id='${inputParams}'`)
  }

  static findAddresses(inputParams, cb){
    db.all(`SELECT Addresses.*, Contacts.name FROM Addresses JOIN Contacts ON Addresses.contact_id = Contacts.id WHERE contact_id = '${inputParams}'`, (err, rows) =>{
      cb(rows);
    })
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
