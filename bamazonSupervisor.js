var mysql = require("mysql");
var Table = require('cli-table');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;

});

menuOptions();

function menuOptions() {
    inquirer
        .prompt([
            {
                type: 'rawlist',
                name: 'options',
                message: 'What do you want to do?',
                choices: [
                    'View Product Sales by Department',
                    'Create New Department',
                    'Quit'

                ],


            }
        ]).then(function (answers) {
            //console.log(JSON.stringify(answers, null, '  '));
            switch (answers.options) {
                case 'View Product Sales by Department':
                    viewProductsSalesByDep();

                    break;
                case 'Create New Department':
                    createNewDepartment();
                    break;

                case 'Quit':
                    break;
                default:
                    break;
            }
        });

}

function viewProductsSalesByDep() {
    var query = "SELECT d.department_id, p.department_name, d.over_head_costs,sum(p.product_sales)  as product_sales \
                 FROM products as p LEFT JOIN departments as d on p.department_name = d.department_name \
                 GROUP BY d.department_id,p.department_name,d.over_head_costs"

    connection.query(query, function (err, res) {
        if (err) throw err;
        
        var table = new Table({
            head: ['ID', 'DEPARTMENT', 'OVER HEAD COST', 'PRODUCT SALES', 'TOTAL PROFIT']
            , colWidths: [4, 20, 20, 20, 20]
        });

        for (var i = 0; i < res.length; i++) {
            var total_profit = res[i].product_sales - res[i].over_head_costs;
           
            table.push(
                [res[i].department_id,
                res[i].department_name,
                res[i].over_head_costs,
                parseFloat(res[i].product_sales).toFixed(2),
                parseFloat(total_profit).toFixed(2)
                ]);

        }
        
        console.log("\n\n", table.toString());
    });
    menuOptions();
};

function createNewDepartment() {
    inquirer.prompt([
        {
            type: "Input",
            name: "department",
            message: "What is the department name?"
        },
        {
            type: "Input",
            name: "cost",
            message: "What is the overhead cost?"
        }
    ]).then(function (newDepartment) {
        insertDepartment(newDepartment.department, newDepartment.cost);
    });


};

function insertDepartment(departmentName, cost) {
    console.log(departmentName);
    console.log(cost);
    var query = connection.query(
        "INSERT INTO departments SET ?",
        {
            department_name: departmentName,
            over_head_costs: cost

        },
        function (err, res) {
            console.log(departmentName + " - Added to the database of BAMAZON!");
            menuOptions();
        }
    );
}