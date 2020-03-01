var mysql = require("mysql");

var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "killer07",
    database: "bamazon_DB"
});

connection.connect(function(err) {
    if (err) throw err;
    afterConnection();
});

function afterConnection() {
    connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
        if (err) throw err;
        res.forEach( (res) => {
            console.log("----------");
            console.log("Item ID: " + res.item_id);
            console.log("Product: " + res.product_name);
            console.log("Price: " + "$" + res.price);
            console.log("----------");
        });
        connection.end();
    });
}