var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 8080,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "bamazon"
});
console.log("test");

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    readProducts();
  });
  
  function readProducts() {
      console.log("Selecting all products...\n");
      connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        //console.log(res);
  
      for (var i=0; i< res.length;i++) {
          console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price + " | " )
      }
  
  
        connection.end();
      });
    }
    