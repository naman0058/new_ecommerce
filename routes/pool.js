 
var mysql = require('mysql')



const pool = mysql.createPool({

    host :'68.178.175.210',
    user :"root",
    password :"Kinsey@2023",
    database:"inventory",
    port:3306,
   multipleStatements: true,
   connectionLimit: 10,
 })


 



module.exports = pool;

