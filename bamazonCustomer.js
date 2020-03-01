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
        .prompt(
            {
                name: "productId",
                type: "number",
                message: "What is the Item ID of the product you'd like to purchase?",
            },
            {
                name: "productQuantity",
                type: "number",
                message: "How many would you like to purchase?"
            })
            .then(function(response) {
                var product;
                for (var i = 0; i < response.length; i++) {
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
                        }
                    )
                }
            })
            
}