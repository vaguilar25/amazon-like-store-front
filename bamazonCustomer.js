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
console.log("test");

var purchase = function (id, price, quantity) {
    this.id = id,
        this.quantity,
        this.price = price,
        this.total = function () {
            var total = this.price * this.quantity;
            console.log("The total cost of your purchase is: " + parseFloat(total).toFixed(2));
            // return
        }


}

var recentOrder;

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    readProducts();
});

function readProducts(quantitySelect) {

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
        
        inquireIdPurchase();
    });


}




function inquireIdPurchase() {
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

    updateStock(id, new_stock);
}


