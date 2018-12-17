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
    ("Taste of The Wild - Dog Food" , "Pet Supplies" , "48.99", 10,0),
    ("Multipet Large Dog Toy" , "Pet Supplies" , "8.00", 5,0),
    ("Greenies Original Teenie Dental Dog Treats" , "Pet Supplies" , "33.99", 5,0),
    ("Wellness Kittles Crunchy Natural Grain " , "Pet Supplies" , "4", 8,0),
    ("Code Names" , "Toys and Games" , "15", 14,0),
    ("Lego Harry Potter" , "Toys and Games" , "48.99", 5,0),
    ("Catan" , "Toys and Games" , "40.00", 7,0),
    ("Ticket to Ride Europe " , "Toys and Games" , "50.00", 3,0),
    ("4M Crystal Growing Experiment" , "Toys and Games" , "4", 15,0),
    ("Monopoly Fortnite" , "Toys and Games" , "30.00", 20,0);
  
  -- TABLE THAT STORES DEPARTMENTS INFO
CREATE TABLE departments
(
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(50) NOT NULL ,
  over_head_costs DECIMAL (10,2),
   PRIMARY KEY (department_id)
);

-- ADD NEW COLUMN FOR PRODUCTS
ALTER TABLE products 
ADD COLUMN product_sales DECIMAL (10,2);

