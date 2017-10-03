var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./databases/database.db');

class Profiles {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.password = data.password;
    this.contact_id = data.contact_id;
  }

  static findAll(cb){
    db.all('SELECT Profiles.*,Contacts.name FROM Profiles JOIN Contacts ON Profiles.contact_id = Contacts.id', (err, rows) =>{
      let result = []
      rows.forEach((data) => {
        let profiles = new Profiles(data)
        result.push(profiles);
      })
      db.all('SELECT * FROM Contacts', (err, rows2) =>{
        cb(result, rows2)
      })
    })
  }

  static insertProfile(username, password, contact_id, cb){
     db.run(`INSERT INTO Profiles (username, password, contact_id) VALUES ('${username}', '${password}', '${contact_id}')`, (err) => {
       cb(err)
     })
  }

  static editProfilesGet(paramsId, cb){
    db.get(`SELECT * FROM Profiles WHERE id = '${paramsId}'`, function(err, rows){
      let profiles = new Profiles(rows)
      cb(profiles)
    })
  }

  static editProfilesPost(inputParams, username, password){
    db.run(`UPDATE Profiles SET username='${username}', password='${password}' WHERE id='${inputParams}'`)
  }

  static deleteProfiles(inputParams){
    db.run(`DELETE FROM sqlite_sequence WHERE name='Profiles'`)
    db.run(`DELETE FROM Profiles WHERE id='${inputParams}'`)
  }
}

module.exports = Profiles;
