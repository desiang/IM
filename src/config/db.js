const serverlessMysql = require("serverless-mysql");

const db = serverlessMysql({
  config: {
    host: "localhost",
    database: "section_a",
    user: "root",
    password: "",
    port: 3306,
  },
});

module.exports = db;
 