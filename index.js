const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');
const { default: Choices } = require('inquirer/lib/objects/choices');

// at Init, these will be filled with current data!
const deptArray = [];
const roleArray = [];
const managerArray = ['None'];
const employeeArray = [];

// initial inquirer 'home' question
const question = [
    {
        name: 'home',
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee\'s role', 'Quit']
    }
]

// connect mysql to database
const connection = mysql.createConnection(
    {
    host: 'localhost',
    user: '',
    password: '',
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
    });
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
    .then((response) => {
        // first, set user input to constants
        const roleDept = response.department;
        const roleTitle = response.newRole;
        const roleSalary = response.salary;
        connection.query(
            // Get the id of the chosen department for the new role
            `SELECT id FROM department WHERE name = ?`, roleDept, (err, result) => {
                if (err) {
                    console.log(err);
                }

                // This constant is the id of the new role's department
                const deptId = result[0].id;

                connection.query(
                    `INSERT into role (title, salary, department_id) VALUES ('${roleTitle}', ${roleSalary}, ${deptId});`,
                    function (err, results, fields) {
                        //console.log(results);
                        roleArray.push(roleTitle);
                        askQuestion();
                    }
                );
            }
        );
    });
}

// query to add an employee
const addEmployee = () => {

    inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: 'Please enter employee\'s first name:'
        },
        {
            name: 'lastName',
            type: 'input',
            message: 'Please enter employee\'s last name:'
        },
        {
            name: 'role',
            type: 'list',
            message: 'Please select this new employee\'s role:',
            choices: roleArray
        },
        {
            name: 'manager',
            type: 'list',
            message: 'Please select this employee\'s manager:',
            choices: managerArray
        },
    ])
    .then((response) => {
        const first = response.firstName;
        const last = response.lastName;
        const role = response.role;
        const manager = response.manager;
        const employeeName = first.concat(' ', last); // for pushing into employeeArray

        // To get the manager's first name
        const managerSplit = manager.split(' ');
        const managerFirst = managerSplit[0];

        connection.query(
            `SELECT id FROM role WHERE title = ?`, role, (err, result) => {
                if (err) {
                    console.log(err);
                }

                const roleId = result[0].id;

                connection.query(
                    `SELECT id FROM employee WHERE first_name = ?`, managerFirst, (err, result) => {
                        if (err) {
                            console.log(err);

                        } else if (response.manager === 'none') {
                            const managerId = 'null'

                            connection.query(
                                `INSERT INTO employee (first_name, last_name, role, manager_id) VALUES ('${first}', '${last}', '${roleId}', ${managerId});`,
                                function(err, results, fields) {
                                    //console.log(results);
                                    employeeArray.push(employeeName);
                                    //console.log(employeeArray);
                                    askQuestion();
                                }
                            );

                        } else {

                            const managerId = result[0].id;
                            //console.log(managerId);
                            console.log(first, last, role, managerId);
            
                            connection.query(
                                `INSERT INTO employee (first_name, last_name, role, manager_id) VALUES ('${first}', '${last}', '${roleId}', ${managerId});`,
                                function(err, results, fields) {
                                    //console.log(results);
                                    employeeArray.push(employeeName);
                                    //console.log(employeeArray);
                                    askQuestion();
                                }
                            );
                        }
                    }
                );
            }
        );
    });
}

const updateEmployee = () => {

    inquirer.prompt([
        {
            name: 'employee',
            type: 'list',
            message: 'Which employee would you like to update?',
            choices: employeeArray
        },
        {
            name: 'newRole',
            type: 'list',
            message: 'What role would you like to assign the selected employee?',
            choices: roleArray
        },
        {
            name: 'newManager',
            type: 'list',
            message: 'If you would also like to assign a new manager to this employee, select one of the following. Otherwise, select "none"',
            choices: managerArray
        },
    ])
    .then((response) => {

        const employee = response.employee;
        const role = response.newRole;
        const manager = response.newManager;

        // get the selected employee's id
        connection.query(
            `SELECT id FROM employee WHERE CONCAT(employee.first_name, \' \', employee.last_name) = ?`, employee, (err, result) => {
                if (err) {
                    console.log(err);
                }

                // this constant is the selected employee's id
                const employeeID = result[0].id;

                // get the selected role's id
                connection.query(
                    `SELECT id FROM role WHERE title = ?`, role, (err, result) => {
                        if (err) {
                            console.log(err);
                        }
        
                        // this constant is the selected role's id
                        const roleId = result[0].id;

                        // update the selected employee's role based on selected role id
                        connection.query(
                            `UPDATE employee SET role = ${roleId} WHERE id = ?`, employeeID, (err, result) => {
                                if (err) {
                                    console.log(err);
                                }

                                askQuestion();

                                // To get the manager's first name
                                const managerSplit = manager.split(' ');
                                const managerFirst = managerSplit[0];

                                // get the id of the selected manager
                                connection.query(
                                    `SELECT id FROM employee WHERE first_name = ?`, managerFirst, (err, result) => {
                                        if (err) {
                                            console.log(err);
                                        } else if (manager === 'None') {
                                                const managerId = 'null';

                                                // update manager to null
                                                connection.query(
                                                    `UPDATE employee SET manager_id = ${managerId} WHERE id = ?`, employeeID, (err, result) => {
                                                        if (err) {
                                                            console.log(err);
                                                        }

                                                        askQuestion();
                                                    }
                                                )
                                            } else {
                                                const managerId = result[0].id;
                                                //console.log(result);

                                                // update manager to selected manager
                                                connection.query(
                                                    `UPDATE employee SET manager_id = ${managerId} WHERE id = ?`, employeeID, (err, result) => {
                                                        if (err) {
                                                            console.log(err);
                                                        }

                                                        askQuestion();
                                                    }
                                                )
                                            }
                                    }
                                )
                            }
                        )

                    }
                );
            }
        );
    });
}

// Inquirer initial prompt
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
    else if (response.home === 'Add an employee') {
        addEmployee();
    }
    else if (response.home === 'Update an employee\'s role') {
        updateEmployee();
    }
    else if (response.home === 'Quit') {
        // Can I make it exit the application, as in '^C'?
        console.log('Bye! Type control-C to exit the application.')
        return;
    }
})
.catch((error) => {
    console.log('Something happened. OOPS.');
});
};

const init = () => {

    // Get array of departments
    connection.query(
        'SELECT name from department;',
        function(err, results, fields) {
            //push each department name in database into a usable array
            results.forEach(dept => 
                deptArray.push(dept.name));
        }
    );

    // Get array of roles 
    connection.query(
        `SELECT title from role;`,
        function(err, results, fields) {
            results.forEach(role => 
                roleArray.push(role.title));
        }
    );

    // Get array of managers
    connection.query(
        `SELECT CONCAT(employee.first_name, \' \', employee.last_name) AS Managers FROM employee WHERE manager_id IS NULL;`,
        function(err, results, fields) {
            results.forEach(manager =>
                managerArray.push(manager.Managers));            
        }
    );

    // Get array of employees
    connection.query(
        `SELECT CONCAT(employee.first_name, \' \', employee.last_name) AS name FROM employee;`,
        function(err, results, fields) {
            results.forEach(employee =>
                employeeArray.push(employee.name));
                //console.log(employeeArray);
        }
    );

    // Ask first question
    askQuestion();
}

// Start app
init();
