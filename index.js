const mysql = require('mysql2');
const cTable = require('console.table');

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

// query to view all employees
connection.query(
    'select employee.id, first_name, last_name, role.title, salary, department.name AS \'department name\' from employee JOIN role ON employee.role=role.id JOIN department ON role.department_id=department.id;',
    function(err, results, fields) {
        console.table(results);
        //console.log(fields);
    }
);
// select employee.id, first_name, last_name, role.title, salary, department.name AS 'department name' from employee JOIN role ON employee.role=role.id JOIN department ON role.department_id=department.id;

// select a.id, a.first_name, a.last_name, role.title, role.salary, department.name AS 'department name', a.manager_id as 'Manager Name' from employee a JOIN role ON a.role=role.id JOIN department ON role.department_id=department.id JOIN employee b on employee a where b.id = a.manager_id;

// select * from employee a join employee b on a.manager_id=b.id;

// *** select * from employee a left join employee b on a.manager_id=b.id;

// select a.id as ID, CONCAT(a.first_name, ' ', a.last_name) AS Employee, role.title AS 'Job Title', salary AS Salary, department.name AS Department, CONCAT(b.first_name, ' ', b.last_name) AS Manager from employee a JOIN role ON a.role=role.id JOIN department ON role.department_id=department.id LEFT JOIN employee b ON a.manager_id=b.id;