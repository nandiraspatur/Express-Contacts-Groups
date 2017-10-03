var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./databases/database.db');

class Addresses{
  constructor(data) {
    this.id = data.id;
    this.street = data.street;
    this.city = data.city;
    this.zipcode = data.zipcode;
    this.contact_id = data.contact_id;
  }

  static findAll(cb){
    db.all('SELECT * FROM Addresses', (err, rows) =>{
      let result = []
      rows.forEach((data) => {
        let addresses = new Addresses(data)
        result.push(addresses);
      })
      db.all('SELECT * FROM Contacts', (err, rows2) => {
        cb(result, rows2);
      })
    })
  }

  static insertAddresses(street, city, zipcode, contact_id){
    db.run(`INSERT INTO Addresses (street, city, zipcode, contact_id) VALUES ('${street}', '${city}', '${zipcode}', '${contact_id}')`)
  }

  static editAddressesGet(paramsId, cb){
    db.get(`SELECT * FROM Addresses WHERE id = '${paramsId}'`, function(err, rows){
      console.log(rows);
      let addresses = new Addresses(rows)
      db.all(`SELECT * FROM Contacts`, (err, rows2) => {
        cb(addresses, rows2)
      })
    })
  }

  static editAddressesPost(paramsId, street, city, zipcode, contact_id){
    db.run(`UPDATE Addresses SET street='${street}', city='${city}', zipcode='${zipcode}', contact_id='${contact_id}' WHERE id='${paramsId}'`)
  }

  static deleteAddresses(inputParams){
    db.run(`DELETE FROM sqlite_sequence WHERE name='Addresses'`)
    db.run(`DELETE FROM Addresses WHERE id='${inputParams}'`)
  }
}

module.exports = Addresses;
