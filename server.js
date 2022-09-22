const express = require('express');

const mysql = require('mysql2');

const PORT = process.env.PORT || 3000;
const app = express();

// middleware for express
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

// connect to database
const connection = mysql.createConnection(
    {
    host: 'localhost',
    user: 'root',
    password: 'FlirtyB33!',
    database: 'employee_db'
    },
console.log(`Connected to ${database} database!`)
);

connection.execute(
    `SELECT id, name AS Department Name FROM department`
)