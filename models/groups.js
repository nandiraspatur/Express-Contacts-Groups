var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./databases/database.db');

class Groups{
  constructor(data) {
    this.id = data.id;
    this.name_of_group = data.name_of_group;
  }

  static findAll(cb){
    db.all('SELECT * FROM Groups', (err, rows) =>{
      let result = []
      rows.forEach((data) => {
        let groups = new Groups(data)
        result.push(groups);
      })
      cb(result);
    })
  }

  static insertGroups(name_of_group){
    db.run(`INSERT INTO Groups (name_of_group) VALUES ('${name_of_group}')`)
  }

  static editGroupsGet(paramsId, cb){
    db.get(`SELECT * FROM Groups WHERE id = '${paramsId}'`, function(err, rows){
      let groups = new Groups(rows)
      cb(groups)
    })
  }

  static editGroupsPost(paramsID, name_of_group){
    db.run(`UPDATE Groups SET name_of_group='${name_of_group}'WHERE id='${paramsID}'`)
  }

  static deleteGroups(inputParams){
    db.run(`DELETE FROM sqlite_sequence WHERE name='Groups'`)
    db.run(`DELETE FROM Groups WHERE id='${inputParams}'`)
  }
}

module.exports = Groups;
