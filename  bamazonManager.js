var Table = require('cli-table');
var inquirer = require('inquirer');

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
                    'Add New Product'
                ]

            }
        ])
        .then(answers => {
            console.log(JSON.stringify(answers, null, '  '));
            switch (answers.options) {
                case 'View Products for Sale':
                    function viewProducts();
                    break;
                case 'View Low Inventory':
                    function viewLowInventory();
                    break;
                case 'Add to Inventory':
                    function addInventory();
                    break;
                case 'Add New Product':
                    function addNewProduct();
                    break;
                default:
                    break;
            }


        });

    
}

function viewProducts() {

}

function viewLowInventory() {
    
}

function addInventory() {
    
}
function addNewProduct() {
    
}