 
var mysql = require('mysql')



const pool = mysql.createPool({

    host :'db-mysql-blr1-55215-do-user-13029391-0.b.db.ondigitalocean.com',
    user :"doadmin",
    password :"AVNS_BUlYRoHmtHSKlCjHe5y",
    database:"inventory",
    port:25060,
   multipleStatements: true,
   connectionLimit: 10,
 })


 



module.exports = pool;

