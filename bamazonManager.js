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
  //  console.log("connected as id " + connection.threadId + "\n");
    //  readProducts();
});



menuOptions()

function menuOptions() {
    inquirer
        .prompt([
            {
                type: 'rawlist',
                name: 'options',
                message: 'What do you want to do?',
                choices: [
                    'View Products for Sale',
                    'View Low Inventory',
                    new inquirer.Separator(),
                    'Add to Inventory',
                    'Add New Product',
                    'Quit'
                    
                ],
               

            }
        ]).then(function (answers) {
            //console.log(JSON.stringify(answers, null, '  '));
            switch (answers.options) {
                case 'View Products for Sale':
                    viewProducts();
                    menuOptions();
                    break;
                case 'View Low Inventory':
                    viewLowInventory();
                    break;
                case 'Add to Inventory':
                    addInventory();
                    break;
                case 'Add New Product':
                    addNewProduct();
                    break;
                case 'Quit' :
                    return;
                default:
                    break;
            }
        });

    }

function viewProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        //console.log(res);

        var table = new Table({
            head: ['ID', 'DEPARTMENT', 'PRODUCT', 'PRICE', 'STOCK']
            , colWidths: [4, 20, 50, 10, 10]
        });

        for (var i = 0; i < res.length; i++) {

            table.push(
                [res[i].item_id,
                res[i].department_name,
                res[i].product_name,
                parseFloat(res[i].price).toFixed(2), res[i].stock_quantity]
            );

        }
        console.log(table.toString());
    });
    
}

function viewLowInventory() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products where stock_quantity <5", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        //console.log(res);

        var table = new Table({
            head: ['ID', 'DEPARTMENT', 'PRODUCT', 'PRICE', 'STOCK']
            , colWidths: [4, 20, 50, 10, 10]
        });

        for (var i = 0; i < res.length; i++) {

            table.push(
                [res[i].item_id,
                res[i].department_name,
                res[i].product_name,
                parseFloat(res[i].price).toFixed(2), res[i].stock_quantity]
            );

        }
        console.log(table.toString());
    });
    

}

function addInventory() {

}
function addNewProduct() {

}