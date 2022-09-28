const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');
const { default: Choices } = require('inquirer/lib/objects/choices');

const deptArray = [];

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

//query to view all roles
const viewRoles = () => {
    connection.query(
        'SELECT role.id AS ID, title as \'Job Title\', salary as Salary, department.name AS Department FROM role JOIN department ON role.department_id=department.id;',
        function(err, results, fields) {
            console.table(results);
            askQuestion();
            //console.log(fields);
        }
    );
}

// query to add a department
const addDepartment = () => {

    inquirer.prompt([
        {
            name: 'newDepartment',
            type: 'text',
            message: 'Please enter new department name:'
        }
    ])
    .then((response) => {
        connection.query(
            `INSERT into department (name) VALUES ('${response.newDepartment}');`,
            function(err, results, fields) {
                deptArray.push(response.newDepartment);
                askQuestion();
                //console.log(results);
            }
        );
        
    })

}

// query to add a role
const addRole = () => {

    inquirer.prompt([
        {
            name: 'newRole',
            type: 'text',
            message: 'Please enter the new role title:'
        },
        {
            name: 'salary',
            type: 'text',
            message: 'Please enter the salary for this new role:'
        },
        {
            name: 'department',
            type: 'list',
            message: 'Please select the department to which this role belongs:',
            choices: deptArray
        },

    ])
}


// query to view all employees
const viewEmployees = () => {
    connection.query(
        'select a.id as ID, CONCAT(a.first_name, \' \', a.last_name) AS Employee, role.title AS \'Job Title\', salary AS Salary, department.name AS Department, CONCAT(b.first_name, \' \', b.last_name) AS Manager from employee a JOIN role ON a.role=role.id JOIN department ON role.department_id=department.id LEFT JOIN employee b ON a.manager_id=b.id;',
        function(err, results, fields) {
            console.table(results);
            askQuestion();
            //console.log(fields);
        }
    );
}


const question = [
    {
        name: 'home',
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee\'s role', 'Quit']
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
    else if (response.home === 'View all roles') {
        viewRoles();
    }
    else if (response.home === 'View all employees') {
        viewEmployees();
    }
    else if (response.home === 'Add a department') {
        addDepartment();
    }
    else if (response.home === 'Add a role') {
        addRole();
    }
    else if (response.home === 'Quit') {
        // Can I mak it exit the application, as in '^C'?
        return;
    }
})
.catch((error) => {
    console.log('Something happened. OOPS.')
    // Something happened. OOPS.
    
});
};

const init = () => {

    // Push departments names from database into a usable array
    connection.query(
        'Select name from department;',
        function(err, results, fields) {
            //console.log(results.length);
            //push each department name in database into a usable array
            results.forEach(dept => 
                deptArray.push(dept.name));

                //console.log(deptArray);

        }
    );

    // Ask first question
    askQuestion();
}

// Start app
init();