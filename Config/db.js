const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'database_curd'
})

connection.connect((error)=>{
        if(error) throw error;

        console.log('database connected successfully')
})

module.exports = connection