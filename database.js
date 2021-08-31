const Database = require('sqlite-async');

class MyDb {
  constructor(dbName) {
    this.dbName = dbName;
    Database.open(this.dbName).then(async db => {
      this.instance = db;
      await this.instance.run(`CREATE TABLE IF NOT EXISTS Users
                        (_id INTEGER PRIMARY KEY AUTOINCREMENT,
                        username VARCHAR(100) NOT NULL);
                      `);
      await this.instance.run(`CREATE TABLE IF NOT EXISTS Exercises 
                        (_id INTEGER PRIMARY KEY AUTOINCREMENT,
                        description VARCHAR(100) NOT NULL,
                        duration INTEGER NOT NULL,
                        date INTEGER DEFAULT (STRFTIME('%s', 'now') * 1000),
                        userId INTEGER NOT NULL,
                        
                        FOREIGN KEY (userId) REFERENCES Users(_id))
                        `);     
      this.instance.run('PRAGMA foreign_keys = ON;');
    }).catch(e => console.error('Can not open database connection', e));
  }

  async run(query, ...args) {
    return await this.instance.run(query, args);
  }

  async get(query, ...args) {
    return await this.instance.get(query, args);
  }

  async all(query, ...args) {
    return await this.instance.all(query, args);
  }
}

module.exports = MyDb;