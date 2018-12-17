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

var purchase = function (id, price,quantity) {
    this.id = id,
        this.quantity,
        this.price = price,
        this.total = function() {
           var total=this.price * this.quantity; 
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
    console.log("Selecting all products...\n");
   connection.query("SELECT * FROM products", function (err, res) {
       
        if (err) throw err;
        // Log all results of the SELECT statement
        //console.log(res);

        var table = new Table({
            head: ['ID', 'DEPARTMENT', 'PRODUCT', 'PRICE', 'STOCK']
            , colWidths: [4, 20, 45, 10, 10]
        });

        for (var i = 0; i < res.length; i++) {

            table.push([res[i].item_id, res[i].department_name, res[i].product_name, parseFloat(res[i].price).toFixed(2), res[i].stock_quantity]);

        }
        console.log(table.toString());

     // recentOrder.total();


    });
    
    //if (!isNaN(recentOrder)) {
      // recentOrder.total();
   // }
   // return
}
inquireIdPurchase();
//recentOrder.total();


function inquireIdPurchase() {
    inquirer.prompt([
        {
            type: "Input",
            name: "id",
            message: "What is the id of the item you would like to purchase?"
        }
    ]).then(function (idSelect) {

        inquireQuantityPurchase(idSelect.id);

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
            // Log all results of the SELECT statement
            //console.log(res);
            var results = res[0];

            if (quantitySelect <= results.stock_quantity) {
                var new_stock = results.stock_quantity - quantitySelect;
                selectProductSales(idSelect, quantitySelect,results.price,new_stock);
               // updateStock(idSelect, new_stock);

                //readProducts();
                
                // if (!isNaN(recentOrder) ) {
                //console.log("The total cost of your purchase is:" + recentOrder.total);
                //}


                //console.log("Your TOTAL purchase is: $" +  parseFloat(totalPurchase).toFixed(2));
            } else {
                console.log("Insufficient quantity!");
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
            // Log all results of the SELECT statement
            //console.log(res);


            // connection.end();
        });

        readProducts();
}

function selectProductSales(idSelect, quantitySelect, price,new_stock) {
    //  recentOrder = new purchase(idSelect,results.price,parseFloat(totalPurchase).toFixed(2));
   // var totalPurchase = quantitySelect * price;
   
     recentOrder = new purchase(idSelect, price,quantitySelect);
    //return recentOrder;
    var query = "SELECT coalesce(product_sales,0) as product_sales FROM products where item_id = " + idSelect;
    
    connection.query(query,function (err, res, fields) {
        if (err) throw err;
        // Log all results of the SELECT statement
        //console.log(res);
        

        // connection.end();
        
        calculatePurchase(idSelect, quantitySelect, price,new_stock,res[0].product_sales)
    });
    
}
 function calculatePurchase(id, quantitySelect, price,new_stock,product_sales) {   
   
    var totalSales = product_sales + (price * quantitySelect);
    var query ="UPDATE products set product_sales = " + parseFloat(totalSales).toFixed(2) + " WHERE item_id =" + id;
   
    connection.query(query,
    function (err, res, fields) {
        if (err) throw err;
       

        // connection.end();
    });

   // readProducts();

    updateStock(id, new_stock);
}


