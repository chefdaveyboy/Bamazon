var mysql = require("mysql");

var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "killer07",
    database: "bamazon_DB"
});

function exit() {
    console.log("Thanks for stopping by!  We hope to see you again soon!");
    connection.end();
}

function restart() {
    inquirer
        .prompt([
            {
            name: "confirm",
            type: "confirm",
            message: "Would you like to continue shopping?",
            default: true
            }
        ])
        .then(function(response) {
            if (response.confirm) {
                bamazonInquirer();
            }
            else {
                exit();
            }
        });
}

connection.connect(function(err) {
    if (err) throw err;
    afterConnection();
});

function afterConnection() {
    connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
        if (err) throw err;
        console.log("--WELCOME TO BAMAZON--");
        res.forEach( (res) => {
            console.log("----------");
            console.log("Item ID: " + res.item_id);
            console.log("Product: " + res.product_name);
            console.log("Price: " + "$" + res.price);
            console.log("----------");
        });

        bamazonInquirer();
    });
}

function bamazonInquirer() {
    
    inquirer
        .prompt([
            {
                name: "productId",
                type: "number",
                message: "What is the Item ID of the product you'd like to purchase?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "productQuantity",
                type: "number",
                message: "How many would you like to purchase?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
            .then(function(response) {
                connection.query("SELECT * FROM products", function(err, res){  
                    var product;
                    for (var i = 0; i < res.length; i++) {
                        if (res[i].item_id === response.productId) {
                            product = res[i];
                        }
                    }
                    if (product.stock_quantity >= response.productQuantity) {
                        connection.query("UPDATE products SET ? WHERE ?", 
                        [
                            {
                                stock_quantity: product.stock_quantity - response.productQuantity
                            },
                            {
                                item_id: product.item_id
                            }
                        ],
                        function (err) {
                            if (err) throw err;
                            console.log("----------");
                            console.log("Your order of " + response.productQuantity + " " + product.product_name + "(s) was placed successfully! Thank you!");
                            console.log("Your total is: $" + response.productQuantity * product.price);
                            console.log("----------");
                            restart();
                            }
                            
                        );
                    }
                    else {
                        console.log("I'm sorry, the product you're looking for doesn't exist or is currently out of stock.");
                        restart();
                    }
                })
                
            })
            
}

