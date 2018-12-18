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

// Initial options

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

            switch (answers.options) {
                case 'View Products for Sale':
                    viewProducts();

                    break;
                case 'View Low Inventory':
                    viewLowInventory();
                    break;
                case 'Add to Inventory':
                    createArrayOfProducts();
                    break;
                case 'Add New Product':
                    selectDepartments();
                    break;
                case 'Quit':
                    //console.log("QUIT");
                    connection.end();
                    process.exit();
                    break;
                default:
                    break;
            }
        });

}

//create array of products to display as a selection when is prompted
function createArrayOfProducts() {

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        var arrayProducts = [];

        for (var i = 0; i < res.length; i++) {


            arrayProducts.push({ key: res[i].item_id, value: res[i].product_name });

        }
        addNewInventory(arrayProducts);

    });

}

//FUNCTION TO DISPLAY TABLE OF PRODUCTS
function viewProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        arrayProducts = [];
        var table = new Table({
            head: ['ID', 'DEPARTMENT', 'PRODUCT', 'PRICE', 'STOCK','SALES']
            , colWidths: [4, 20, 45, 10, 10,10]
        });

        for (var i = 0; i < res.length; i++) {

            table.push(
                [res[i].item_id,
                res[i].department_name,
                res[i].product_name,
                parseFloat(res[i].price).toFixed(2),
                res[i].stock_quantity,
                res[i].product_sales
                ]
            );
            arrayProducts.push(res[i].item_id = res[i].product_name);

        }
        console.log(table.toString());
        menuOptions();
    });

}

//VIEW LOW INVENTORY
function viewLowInventory() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products where stock_quantity <5", function (err, res) {
        if (err) throw err;


        var table = new Table({
            head: ['ID', 'DEPARTMENT', 'PRODUCT', 'PRICE', 'STOCK', 'SALES']
            , colWidths: [4, 20, 50, 10, 10,10]
        });

        for (var i = 0; i < res.length; i++) {

            table.push(
                [res[i].item_id,
                res[i].department_name,
                res[i].product_name,
                parseFloat(res[i].price).toFixed(2), res[i].stock_quantity,
                res[i].product_sales]
            );

        }
        console.log(table.toString());
        menuOptions();
    });


}

//PROMPT TO ADD NEW PRODUCT

function addNewProduct(array) {
    inquirer.prompt([
        {
            type: "Input",
            name: "name",
            message: "What is the name of the product you would like to add?"
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

//ADD INVENTORY -- PROMPT THE USER TO SELECT THE PRODUCT HE WANTS TO UPDATE 
function addNewInventory(arrayProducts) {

    inquirer.prompt([
        {
            type: "list",
            message: "Select the product you want to add stock:",
            choices: arrayProducts,
            name: "product"


        }
    ]).then(function (addStock) {

        console.log("stock", addStock.product);

        getCurrenStock(addStock.product);

    });

}

//ADD INVENTORY -- PROMPT THE USER TO SELECT THE QUANTITY HE WANT TO ADD INVENTORY TO 
function promptForQuantity(product, currentStock) {

    inquirer.prompt([

        {
            type: "input",
            message: "How much quantity you want to add?",
            name: "quantity"
        }
    ]).then(function (response) {

        var newStock = parseInt(currentStock) + parseInt(response.quantity);
        updateInventory(product, newStock);


    });

}
//ADD INVENTORY -- GET CURRENT STOCK
function getCurrenStock(product) {
    var query = `SELECT stock_quantity FROM products where product_name = "${product}"`;

    connection.query(query, function (err, res) {

        if (err) throw err;

        promptForQuantity(product, res[0].stock_quantity);

    });

}
//ADD INVENTORY -- UPDATE PRODUCT QUANTITY
function updateInventory(name, stock) {

    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: stock
            },
            {
                product_name: name
            }
        ],
        function (err, res) {
            menuOptions();
        }
    );


}

//INSERT PRODUCT
function insertProduct(productName, departmentName, price, quantity) {
    var query = connection.query(
        "INSERT INTO products SET ?",
        {
            product_name: productName,
            department_name: departmentName,
            price: price,
            stock_quantity: quantity,
            product_sales: 0
        },
        function (err, res) {
            console.log(productName + "Added to the database of BAMAZON!");
            menuOptions();
        }
    );
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

