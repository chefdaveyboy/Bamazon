var mysql = require("mysql");

var inquirer = require("inquirer");

require("dotenv").config();

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.DB_PASS,
    database: "bamazon_DB"
});

connection.connect(function(err) {
    if (err) throw err;
    bamazonManager();
});

function exit() {
    console.log("Logging Off..");
    connection.end();
}

function bamazonManager() {
    console.log("--WELCOME TO BAMAZON MANAGERS--");
    inquirer
        .prompt([
            {
                name: "options",
                type: "list",
                message: "What would you like to do today?",
                choices:  ["View Products", "View Low Inventory", "Add Inventory", "Add Product", "Log Out"]
            }
        ])
        .then(function(response) {
            var userChoice = response.options;
            if (userChoice === "View Products") {
                viewProducts();
                
            }
            else if (userChoice === "View Low Inventory") {
                lowInventory();
                
                
            }
            else if (userChoice === "Add Inventory") {
                addInventory();
                
                
            }
            else if (userChoice === "Add Product") {
                addProduct();
                
                
            }
            else if (userChoice === "Log Out") {
                exit();
                
            }
        })
}

function viewProducts() {
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, res) {
        if (err) throw err;
        console.log("--CURRENT INVENTORY--");
        console.table(res);
        bamazonManager();
    });
}

function lowInventory() {
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5", function(err, res) {
        if (err) throw err;
        console.log("--LOW INVENTORY--");
        console.table(res);
        bamazonManager();
    });
}

function addInventory() {
    connection.query("SELECT * FROM products", function(err, res) {
      inquirer
        .prompt([
            {
                name: "productId",
                type: "number",
                message: "Please enter the Product ID of the item you'd like to add inventory to.",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "quantity",
                type: "number",
                message: "How many are you adding to inventory?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function(response) {
            var product;
            for (var i = 0; i < res.length; i++) {
                if (res[i].item_id === response.productId) {
                    product = res[i];
                }
            }
            var newQuantity = product.stock_quantity + response.quantity;
            connection.query("UPDATE products SET ? WHERE ?",
            [
                {
                    stock_quantity: newQuantity
                },
                {
                    item_id: product.item_id
                }
            ],
            function (err, res) {
                if (err) throw err;
                console.log("----------");
                console.log("Product: " + product.product_name);
                console.log("Updated Quantity: " + newQuantity);
                console.log("----------");
                bamazonManager();
            }
            )
        }); 
    });
    
}

function addProduct() {
    inquirer
        .prompt([
            {
                name: "productName",
                type: "input",
                message: "What is the name of the product you're trying to add?"
            },
            {
                name: "department",
                type: "list",
                message: "What department does your product best fit into?",
                choices: ["Electronics", "Toys & Games", "Kitchen", "Home & Garden", "Clothing", "Automotive", "Other"]
            },
            {
                name: "price",
                type: "number",
                message: "Please enter the price of the product.",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "quantity",
                type: "number",
                message: "How many are you adding to the stock?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function(response) {
            connection.query("INSERT INTO products SET ?",
            {
                product_name: response.productName,
                department_name: response.department,
                price: response.price,
                stock_quantity: response.quantity
            },
            function(err, res) {
                if (err) throw err;
                console.log("--PRODUCT SUCCESSFULLY ADDED--");
                console.log("Product: " + response.productName);
                console.log("Department: " + response.department);
                console.log("Price: " + "$" + response.price);
                console.log("Quantity: " + response.quantity);
                bamazonManager();
            }
            )
        })
}