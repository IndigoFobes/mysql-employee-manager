// const express = require('express');

const mysql = require('mysql2');
const cTable = require('console.table');

// const app = express();

// middleware for express
// app.use(express.urlencoded({ extended: false}));
// app.use(express.json());

// connect mysql to database
const connection = mysql.createConnection(
    {
    host: 'localhost',
    user: 'root',
    password: 'FlirtyB33!',
    database: 'employee_db'
    },
console.log(`Connected to database!`)
);

// query to view all departments
connection.query(
    'SELECT * FROM department',
    function(err, results, fields) {
        console.table(results);
        //console.log(fields);
    }
);

// query to view all roles
connection.query(
    'SELECT role.id, title, salary, department.name AS \'department name\' FROM role JOIN department ON role.department_id=department.id;',
    function(err, results, fields) {
        console.table(results);
        //console.log(fields);
    }
);
// select role.id, title, salary, department.name as department name FROM role JOIN department ON role.department_id=department.id;