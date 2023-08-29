//dependencies required
const mysql = require("mysql2");
const inquirer = require("inquirer");
require("console.table");
const validate = require("./validate"); // Validator contains functions that can be used to validate user input
//const sql = require("./sql");
const connection = require("./config/connection");

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
     
    // runs the app
    employeeTracker();
});

// function which prompts the user for what action they should take
function employeeTracker() {

  inquirer
    .prompt({
       // Begin Command Line
      type: "list",
      name: "task",
      message: "What would you like to do?",
      choices: [
        "View All Departments",
        "View All roles",
        "View All Employees",
        "Add a Department",  
        "Add a Role",
        "Add a Employee",
        "Update Employee Role",
         //Extra functionality
        "Update Employee Manager",
        "View employees by manager" ,
        "view employees by department",
        "View Department Budget",
        "Remove departments",
        "Remove roles",
        "Remove Employees",
        
        "Log Out"]
   
})
    .then(function ({ task }) {
      switch (task) {

        case "View All Departments":
          viewAllDepartment();
        break;

        case "View All roles":
          viewAllRoles();
        break;

        case "View All Employees":
        viewAllEmployee();
        break;

        case "Add a Department":
          addDepartment();
        break; 
      
        case "Add a Role":
            addRole();
        break;

        case "Add a Employee":
          addEmployee();
        break;

        case "Update Employee Role":
          updateEmployeeRole();
        break;

        case "Update Employee Manager":
          updateEmployeeManager();
        break;
        
        case "View employees by manager":
          viewEmployeesByManager();
        break;
        case "view employees by department":
          viewEmployeeByDepartment();
        break;

        case "View Department Budget":
          viewDepartmentBudget();
        break;

        case "Remove departments":
          removeDepartment();
        break;

        case "Remove roles":
            removeRole();
        break;

        case "Remove Employees":
            removeEmployees();
        break;

        case "Log Out":
          connection.end();
        break;
      }
    });
}

//View Employees/ READ all, SELECT * FROM
function viewAllEmployee() {
  console.log("Viewing employees\n");

  var query =
  `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e
  LEFT JOIN role r
  ON e.role_id = r.id
  LEFT JOIN department d
  ON d.id = r.department_id
  LEFT JOIN employee m
  ON m.id = e.manager_id
  ORDER BY e.id`

  connection.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);
    console.log("Employees viewed!\n");

    employeeTracker();
  });

}
function viewAllDepartment() {
  console.log("Viewing departements\n");

  var query =
    `SELECT * FROM department`
  connection.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);
    console.log("Departement viewed!\n");

    employeeTracker();
  });

}
function viewAllRoles() {
  console.log("Viewing roles\n");

  var query =
    `SELECT * FROM role`
  connection.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);
    console.log("Role viewed!\n");

    employeeTracker();
  });

}

// Insert new employee
function addEmployee() {
  console.log("Inserting an employee!")

  var query =
    `SELECT id, title, salary 
      FROM role`

  connection.query(query, function (err, res) {
    if (err) throw err;

    const roleChoices = res.map(({ id, title, salary }) => ({
      value: id, title: `${title}`, salary: `${salary}`
    }));

    console.table(res);
    console.log("RoleToInsert!");

    promptInsert(roleChoices);
  });
}

function promptInsert(roleChoices) {

  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the employee's first name?",
        validate: (firstName) => {
          if (firstName) {
            return true;
          } else {
            console.log("Please enter first name");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the employee's last name?",
        validate: (firstName) => {
          if (firstName) {
            return true;
          } else {
            console.log("Please enter first name");
            return false;
          }
        },
      },
      {
        type: "list",
        name: "roleId",
        message: "What is the employee's role?",
        choices: roleChoices
      },
    ])
    .then(function (answer) {
      console.log(answer);
      var query = `INSERT INTO employee SET ?` 
      connection.query(query,
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.roleId,
          manager_id: answer.managerId,
        },
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log(res.insertedRows + "Inserted successfully!\n");

          employeeTracker();
        });
    });
}

function removeDepartment(){
  console.log("Deleting an department");

  var query =
    `SELECT id,name
      FROM department`

  connection.query(query, function (err, res) {
    if (err) throw err;

    const deleteDepartmentChoices = res.map(({ id, name}) => ({
      value: id, name: `${id} ${name}`
    }));

    console.table(res);
    console.log("List To Delete!\n");

    promptDepartmentDelete(deleteDepartmentChoices);
  });
}

// User choose the employee list, then employee is deleted
function promptDepartmentDelete(deleteDepartmentChoices) {

  inquirer
    .prompt([
      {
        type: "list",
        name: "departmentId ",
        message: "Which department do you want to remove?",
        choices: deleteDepartmentChoices
      }
    ])
    .then(function (answer) {

      var query = `DELETE FROM departement WHERE ?`; 
      connection.query(query, { id: answer.departmentId }, function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log(res.affectedRows + "Deleted!\n");

        employeeTracker();
      });
    });
}

function removeRole(){

  console.log("Deleting an role");

  var query =
    `SELECT id,title,salary
      FROM role`
  connection.query(query, function (err, res) {
    if (err) throw err;

    const deleteRoleChoices = res.map(({ id, title, salary}) => ({
      value: id, name: `${id} ${title} ${salary}`
    }));

    console.table(res);
    console.log("List To Delete!\n");

    promptRoleDelete(deleteRoleChoices);
  });
}

// User choose the employee list, then employee is deleted
function promptRoleDelete(deleteRoleChoices) {

  inquirer
    .prompt([
      {
        type: "list",
        name: "roleId",
        message: "Which role do you want to remove?",
        choices: deleteRoleChoices
      }
    ])
    .then(function (answer) {

      var query = `DELETE FROM role WHERE ?`; 
      connection.query(query, { id: answer.roleId }, function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log(res.affectedRows + "Deleted!\n");

        employeeTracker();
      });
    });
}
//"Remove Employees"   
function removeEmployees() {
  console.log("Deleting an employee");

  var query =
    `SELECT id,first_name,last_name
      FROM employee`

  connection.query(query, function (err, res) {
    if (err) throw err;

    const deleteEmployeeChoices = res.map(({ id, first_name, last_name }) => ({
      value: id, name: `${id} ${first_name} ${last_name}`
    }));

    console.table(res);
    console.log("ArrayToDelete!\n");

    promptEmployeeDelete(deleteEmployeeChoices);
  });
}

// User choose the employee list, then employee is deleted
function promptEmployeeDelete(deleteEmployeeChoices) {

  inquirer
    .prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee do you want to remove?",
        choices: deleteEmployeeChoices
      }
    ])
    .then(function (answer) {

      var query = `DELETE FROM employee WHERE ?`; 
      connection.query(query, { id: answer.employeeId }, function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log(res.affectedRows + "Deleted!\n");

        employeeTracker();
      });
    });
}

function updateEmployeeManager() {

  console.log("Updating an employee manager");

  var query =
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary,m.id , CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    JOIN role r
    ON e.role_id = r.id
    JOIN department d
    ON d.id = r.department_id
    JOIN employee m
    ON m.id = e.manager_id`

  connection.query(query, function (err, res) {
    if (err) throw err;

    const employeeChoices = res.map(({ id, first_name, last_name }) => ({
      value: id, name: `${first_name} ${last_name}`      
    }));

    console.table(res);
    console.log("employee list to Update!\n")

    managerList(employeeChoices);
  });
}

function managerList(employeeChoices) {
  console.log("Updating an manager");

  var query =
    `SELECT e.id AS managerId, title, salary 
    FROM employee e
    LEFT JOIN role r
    ON r.id = e.id
    WHERE manager_id is null`
  let managerChoices;

  connection.query(query, function (err, res) {
    if (err) throw err;

    managerChoices = res.map(({ id, first_name, last_name }) => ({
      value: id, first_name: `${first_name}`, last_name : `${last_name }`      
    }));

    console.table(res);
    console.log("roleArray to Update!\n")

    promptEmployeeRole(employeeChoices, managerChoices);
  });
}

function promptEmployeeRole(employeeChoices, managerChoices) {

  inquirer
    .prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee do you want to update his manager?",
        choices: employeeChoices
      },
      {
        type: "list",
        name: "managerId",
        message: "Which manager do you want to choose?",
        choices: managerChoices
      },
    ])
    .then(function (answer) {

      var query = `UPDATE employee SET manager_id = ? WHERE id = ?` 
      connection.query(query,
        [ answer.managerId,  
          answer.employeeId
        ],
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log(res.affectedRows + "Updated successfully!");

          employeeTracker();
        });
    });

}

//"Update Employee Role"  
function updateEmployeeRole() {  

  console.log("Updating an employee");

  var query =
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e
  JOIN role r
	ON e.role_id = r.id
  JOIN department d
  ON d.id = r.department_id
  JOIN employee m
	ON m.id = e.manager_id`

  connection.query(query, function (err, res) {
    if (err) throw err;

    const employeeChoices = res.map(({ id, first_name, last_name }) => ({
      value: id, name: `${first_name} ${last_name}`      
    }));

    console.table(res);
    console.log("employeeArray To Update!\n")

    roleList(employeeChoices);
  });
}

function roleList(employeeChoices) {
  console.log("Updating an role");

  var query =
    `SELECT id, title, salary 
  FROM role`
  let roleChoices;

  connection.query(query, function (err, res) {
    if (err) throw err;

    roleChoices = res.map(({ id, title, salary }) => ({
      value: id, title: `${title}`, salary: `${salary}`      
    }));

    console.table(res);
    console.log("roleArray to Update!\n")

    promptEmployeeRole(employeeChoices, roleChoices);
  });
}

function promptEmployeeRole(employeeChoices, roleChoices) {

  inquirer
    .prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employee do you want to set with the role?",
        choices: employeeChoices
      },
      {
        type: "list",
        name: "roleId",
        message: "Which role do you want to update?",
        choices: roleChoices
      },
    ])
    .then(function (answer) {

      var query = `UPDATE employee SET role_id = ? WHERE id = ?` 
      connection.query(query,
        [ answer.roleId,  
          answer.employeeId
        ],
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log(res.affectedRows + "Updated successfully!");

          employeeTracker();
        });
    });
}

//"View Employees by Manager"  
function viewEmployeesByManager() {
  console.log("Viewing managers list\n");
  var query =
    `SELECT e.id , e.first_name, e.last_name,manager_id, r.title, d.name AS department
    FROM employee e
    LEFT JOIN role r
    ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    WHERE manager_id is null`

  connection.query(query, function (err, res) {
    if (err) throw err;

    const managerChoices = res.map(({ id, first_name, last_name }) => ({
      // value: data.id, name: data.name
      value: id, first_name: `${first_name}`,last_name: `${last_name}`
    }));

    console.table(res);
    console.log("Manager view succeed!\n");

    promptManagers(managerChoices);
  });

}
// User choose the manager list, then employees pop up
function promptManagers(managerChoices) {

  inquirer
    .prompt([
      {
        type: "list",
        name: "managerId",
        message: "Which manager would you choose?",
        choices: managerChoices
      }
    ])
    .then(function (answer) {
      console.log("answer ", answer.managerId);

      var query =
        `SELECT e.id, e.first_name, e.last_name, r.title, e.manager_id , d.name AS department 
        FROM employee e
        LEFT JOIN role r
        ON e.role_id = r.id
        LEFT JOIN employee m
        ON e.id = m.manager_id
        LEFT JOIN department d
        ON r.id=d.id 
        WHERE e.manager_id = ?`

      connection.query(query, answer.managerId, function (err, res) {
        if (err) throw err;

        console.table("response ", res); 
        console.log("Viewing employees by manager\n");

        employeeTracker();
      });
    });
}

//"View Employees by Department"  
function viewEmployeeByDepartment() {
  console.log("Viewing employees by department\n");

  var query =
    `SELECT d.id, d.name AS Department
  FROM employee e
  LEFT JOIN role r
	ON e.role_id = r.id
  LEFT JOIN department d
  ON d.id = r.department_id
  GROUP BY d.id, d.name`

  connection.query(query, function (err, res) {
    if (err) throw err;

    const departmentChoices = res.map(data => ({
      value: data.id, name: data.name
    }));

    console.table(res);
    console.log("Department view succeed!\n");

    promptDepartment(departmentChoices);
  });
}

// User choose the department list, then employees pop up
function promptDepartment(departmentChoices) {

  inquirer
    .prompt([
      {
        type: "list",
        name: "departmentId",
        message: "Which department would you choose?",
        choices: departmentChoices
      }
    ])
    .then(function (answer) {
      console.log("answer ", answer.departmentId);

      var query =
        `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department 
        FROM employee e
        JOIN role r
        ON e.role_id = r.id
        JOIN department d
        ON d.id = r.department_id
        WHERE d.id = ?`

      connection.query(query, answer.departmentId, function (err, res) {
        if (err) throw err;

        console.table("response ", res);
        console.log("Employees are viewed!\n");

        employeeTracker();
      });
    });
}

// "Add Department"  
function addDepartment() {

  inquirer
  .prompt([
    {
      type: "input",
      name: "newDepartment",
      message: "What is the Department's name?", 
      validate: validate.validateString,
    },
  ])
  .then(function (answer) {
    var query = `INSERT INTO department SET ?`
    connection.query(query, {
      name: answer.newDepartment 
    },
      function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log("Department Inserted!");

        viewAllDepartment()

        employeeTracker();
      });

  });
  
}
 

//"Add Role"  
function addRole() {

  var query =
    `SELECT d.id, d.name, r.salary AS budget
  FROM employee e
  JOIN role r
  ON e.role_id = r.id
  JOIN department d
  ON d.id = r.department_id
  GROUP BY d.id, d.name,r.salary`

  connection.query(query, function (err, res) {
    if (err) throw err;

    // (callbackfn: (value: T, index: number, array: readonly T[]) => U, thisArg?: any)
    const departmentChoices = res.map(({ id, name }) => ({
      value: id, name: `${id} ${name}`
    }));

    console.table(res);
    console.log("Department list!");

    promptAddRole(departmentChoices);
  });
}

function promptAddRole(departmentChoices) {

  inquirer
    .prompt([
      {
        type: "input",
        name: "roleTitle",
        message: "Role title?"
      },
      {
        type: "input",
        name: "roleSalary",
        message: "Role Salary"
      },
      {
        type: "list",
        name: "departmentId",
        message: "Department?",
        choices: departmentChoices
      },
    ])
    .then(function (answer) {

      var query = `INSERT INTO role SET ?`

      connection.query(query, {
        title: answer.title,
        salary: answer.salary,
        department_id: answer.departmentId
      },
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log("New Role Inserted!");

          employeeTracker();
        });

    });
}
 //"View Budget by Department"  
    
 function  viewDepartmentBudget() {
  console.log("Viewing Budget by Department\n");

  var query =
  `SELECT r.department_id AS id, d.name AS Department,SUM (r.salary) AS Budget 
  FROM employee e 
  INNER JOIN role r 
  INNER JOIN department d
  ON r.department_id = d.id
  ON e.role_id = r.id
  GROUP BY r.department_id, d.name`

  connection.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);
    console.log("Budget by Department viewed!\n");

    employeeTracker();
});
}