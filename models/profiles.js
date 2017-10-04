var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./databases/database.db');

class Profiles {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.password = data.password;
    this.contact_id = data.contact_id;
  }

  static findAll(){
    let promiseObj = new Promise((resolve, reject) => {
      db.all('SELECT Profiles.*,Contacts.name FROM Profiles JOIN Contacts ON Profiles.contact_id = Contacts.id', (err, rows) =>{
        let result = []
        rows.forEach((data) => {
          let profiles = new Profiles(data)
          result.push(profiles);
        })
        resolve(result)
      })
    });
    return promiseObj
  }

  static insertProfile(username, password, contact_id){
    let promiseObj = new Promise((resolve, reject) => {
      db.run(`INSERT INTO Profiles (username, password, contact_id) VALUES ('${username}', '${password}', '${contact_id}')`, (err) => {
        resolve(err)
      })
    });
    return promiseObj
  }

  static editProfilesGet(paramsId){
    let promiseObj = new Promise((resolve, reject) => {
      db.get(`SELECT * FROM Profiles WHERE id = '${paramsId}'`, (err, rows) => {
        let profiles = new Profiles(rows)
        resolve(profiles)
      })
    });
    return promiseObj
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
