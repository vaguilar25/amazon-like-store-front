DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

-- TABLE THAT STORES PRODUCTS OF THE STORE
CREATE TABLE products
(
  item_id INT NOT NULL
  AUTO_INCREMENT,
  product_name VARCHAR
  (50) NOT NULL ,
  department_name VARCHAR
  (50) NOT NULL ,
  price DECIMAL
  (10,2),
  stock_quantity INT,
    PRIMARY KEY
  (item_id)

);

-- Initial Data
  insert into products
    (product_name,department_name,price,stock_quantity)
  values
    ("Taste of The Wild - Dog Food" , "Pet Supplies" , "48.99", 10),
    ("Multipet Large Dog Toy" , "Pet Supplies" , "8.00", 5),
    ("Greenies Original Teenie Dental Dog Treats" , "Pet Supplies" , "33.99", 5),
    ("Wellness Kittles Crunchy Natural Grain " , "Pet Supplies" , "4", 8),
    ("Code Names" , "Toys and Games" , "15", 14),
    ("Lego Harry Potter" , "Toys and Games" , "48.99", 5),
    ("Catan" , "Toys and Games" , "40.00", 7),
    ("Ticket to Ride Europe " , "Toys and Games" , "50.00", 3),
    ("4M Crystal Growing Experiment" , "Toys and Games" , "4", 15),
    ("Monopoly Fortnite" , "Toys and Games" , "30.00", 20);
  
                                        