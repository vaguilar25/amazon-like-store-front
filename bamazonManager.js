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

                    break;
                case 'View Low Inventory':
                    viewLowInventory();
                    break;
                case 'Add to Inventory':
                    addInventory();
                    break;
                case 'Add New Product':
                    selectDepartments();
                    break;
                case 'Quit':
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
    menuOptions();
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

function addNewProduct(array) {
    inquirer.prompt([
        {
            type: "Input",
            name: "name",
            message: "What is the name of the product you wouls like to add?"
        },
        {
            type: "list",
            message: "What is the name of the department?",
            choices: array,
            name: "department"
        },
        {
            type: "Input",
            name: "price",
            message: "What is the price of the product?"
        },
        {
            type: "Input",
            name: "stock",
            message: "How many do you have?"
        }
    ]).then(function (newProduct) {
        insertProduct(newProduct.name, newProduct.department, newProduct.price, newProduct.stock);
    });

}

function addInventory() {

}

function insertProduct(productName, departmentName, price, quantity) {
    var query = connection.query(
        "INSERT INTO products SET ?",
        {
            product_name: productName,
            department_name: departmentName,
            price: price,
            stock_quantity: quantity
        },
        function (err, res) {
            console.log("You successfully add your product");
            menuOptions();

            // Call updateSong AFTER the INSERT completes
            // updateSong();
        }
    );

    // logs the actual query being run
    console.log(query.sql);
}

function selectDepartments() {
    connection.query("SELECT distinct department_name FROM products ", function (err, res) {
        var array = [];
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            array.push(res[i].department_name);
        }
        addNewProduct(array)
    });

}

