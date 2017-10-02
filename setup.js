const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./databases/database.db');

function createTable() {
  db.serialize(function() {
    db.run('CREATE TABLE IF NOT EXISTS Contacts(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, company TEXT, telp_number TEXT, email TEXT)', function(err){
      if(err){
        console.log(err);
      }else{
        console.log('table created');
      }
    })

    db.run('CREATE TABLE IF NOT EXISTS Groups(id INTEGER PRIMARY KEY AUTOINCREMENT, name_of_group TEXT)', function(err){
      if(err){
        console.log(err);
      }else{
        console.log('table created');
      }
    })

    db.run('CREATE TABLE IF NOT EXISTS Profiles(id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)', function(err){
      if(err){
        console.log(err);
      }else{
        console.log('table created');
      }
    })

    db.run('CREATE TABLE IF NOT EXISTS Adresses(id INTEGER PRIMARY KEY AUTOINCREMENT, street TEXT, city TEXT, zipcode INTEGER)', function(err){
      if(err){
        console.log(err);
      }else{
        console.log('table created');
      }
    })
  });
}

function alterProfiles() {
  db.run('ALTER TABLE Profiles ADD contact_id INTEGER REFERENCES Contacts(id)', (err) => {
    if(err){
      console.log(err);
    }
  })
}

function alterAddresses() {
  db.run('ALTER TABLE Addresses ADD contact_id INTEGER REFERENCES Contacts(id)', (err) => {
    if(err){
      console.log(err);
    }
  })
}

function alterAddresses() {
  db.run('ALTER TABLE Addresses ADD contact_id INTEGER REFERENCES Contacts(id)', (err) => {
    if(err){
      console.log(err);
    }
  })
}


alterAddresses()
