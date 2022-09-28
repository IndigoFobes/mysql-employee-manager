const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');
const { default: Choices } = require('inquirer/lib/objects/choices');

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
const viewDepartments = () => {

connection.query(
    'SELECT id AS ID, name AS \'Department Name\' FROM department',
    function(err, results, fields) {
        console.table(results);
        askQuestion();
        //console.log(fields);
    }
);
}


// query to view all roles
// connection.query(
//     'SELECT role.id AS ID, title as \'Job Title\', salary as Salary, department.name AS Department FROM role JOIN department ON role.department_id=department.id;',
//     function(err, results, fields) {
//         console.table(results);
//         //console.log(fields);
//     }
// );

// query to view all employees

// connection.query(
//     'select a.id as ID, CONCAT(a.first_name, \' \', a.last_name) AS Employee, role.title AS \'Job Title\', salary AS Salary, department.name AS Department, CONCAT(b.first_name, \' \', b.last_name) AS Manager from employee a JOIN role ON a.role=role.id JOIN department ON role.department_id=department.id LEFT JOIN employee b ON a.manager_id=b.id;',
//     function(err, results, fields) {
//         console.table(results);
//         //console.log(fields);
//     }
// );

const question = [
    {
        name: 'home',
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee\'s role']
    }
]
// Inquirer
const askQuestion = () => {
inquirer
.prompt(question)
.then((response) => {

    console.log(response.home);

    // If statements to determine next function...
    if (response.home === 'View all departments') {
        viewDepartments();
    }
})
.catch((error) => {
    // Something happened. OOPS.
    
});
};

askQuestion();