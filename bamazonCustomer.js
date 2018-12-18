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

//Object to hold the total purchase
var purchase = function (id, quantity, price) {
    this.id = id,
        this.quantity = quantity,
        this.price = price,
        this.total = function () {
            var totalPurchase = this.price * this.quantity;

            if (totalPurchase === 0) {
                console.log("0");
            } else {
                console.log("\x1b[33m The total cost of your purchase is: " + parseFloat(totalPurchase).toFixed(2) + "\n \x1b[37m");
            }

        }


}

var newPurchase = new purchase(0, 0, 0);

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    readProducts();
});

//SELECT THE PRODUCTS TO DISPLAY

function readProducts() {
    connection.query("Select * FROM products", function (err, res) {

        if (err) throw err;
        var table = new Table({
            head: ['ID', 'DEPARTMENT', 'PRODUCT', 'PRICE', 'STOCK', 'SALES']
            , colWidths: [4, 20, 45, 10, 10, 10]
        });

        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].department_name, res[i].product_name, parseFloat(res[i].price).toFixed(2), res[i].stock_quantity, res[i].product_sales]);

        }
        console.log(table.toString());
        console.log("==================================================================================================\n");

        if (newPurchase.id != 0) {
            newPurchase.total();
        }
        inquireIdPurchase();
    });
}

//PROMPT THE USER FOR THE ITEM HE WANTS TO PURCHASE

function inquireIdPurchase() {
    //purchase.total();
    inquirer.prompt([
        {
            type: "Input",
            name: "id",
            message: "What is the id of the item you would like to purchase? (For Quit press Q)"
        }
    ]).then(function (idSelect) {
        if (idSelect.id === "Q") {
            connection.end();
            process.exit();
        } else {
            inquireQuantityPurchase(idSelect.id);
        }
    });

}

//PROMPT THE USER FOR QUANTITY
function inquireQuantityPurchase(idSelect) {
    inquirer.prompt([
        {
            type: "Input",
            name: "quantity",
            message: "How many would you like?"
        }
    ]).then(function (quantitySelect) {
        checkInventory(idSelect, quantitySelect.quantity)
    });
}


// CHECK THE INVENTORY FOR ENOUGH QUANTITY
function checkInventory(idSelect, quantitySelect) {
    connection.query("SELECT product_name,stock_quantity,price FROM products where item_id = ? ",
        [
            idSelect
        ]
        , function (err, res, fields) {
            if (err) throw err;

            var results = res[0];

            if (quantitySelect <= results.stock_quantity) {
                var new_stock = results.stock_quantity - quantitySelect;
                selectProductSales(idSelect, quantitySelect, results.price, new_stock);

            } else {
                console.log("Insufficient quantity!");
                inquireIdPurchase();
            }

        });

}

//UPDATE STOCKS 
function updateStock(idSelect, new_stock) {
    connection.query("UPDATE products set stock_quantity = ? WHERE item_id = ?",
        [
            new_stock,
            idSelect
        ],
        function (err, res, fields) {
            if (err) throw err;

        });

    readProducts();


}

// SELECT PRODUCT SALES TO UPDATE THE PRODUCT SALES

function selectProductSales(idSelect, quantitySelect, price, new_stock) {

    recentOrder = new purchase(idSelect, price, quantitySelect);

    var query = "SELECT coalesce(product_sales,0) as product_sales FROM products where item_id = " + idSelect;

    connection.query(query, function (err, res, fields) {
        if (err) throw err;

        calculatePurchase(idSelect, quantitySelect, price, new_stock, res[0].product_sales)
    });

}

function calculatePurchase(id, quantitySelect, price, new_stock, product_sales) {

    var totalSales = product_sales + (price * quantitySelect);
    var query = "UPDATE products set product_sales = " + parseFloat(totalSales).toFixed(2) + " WHERE item_id =" + id;

    connection.query(query,
        function (err, res, fields) {
            if (err) throw err;
        });


    newPurchase = new purchase(id, quantitySelect, price);

    updateStock(id, new_stock);
}


