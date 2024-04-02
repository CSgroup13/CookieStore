﻿using System.Dynamic;

namespace Server.Models
{
    public class Product
    {
        public int id { get; set; }
        public string category { get; set; }
        public string name { get; set; }
        public double price { get; set; }
        public List<string> ingredients { get; set; }
        public string description { get; set; }
        public int rate { get; set; }
        public string image { get; set; }
        public List<string> tags { get; set; }

        //CREATE
        //return Product object after added or null if it failed
        public Product addProduct()
        {
            DBservices dbs = new DBservices();
            return dbs.addProduct(this);
        }

        //READ
        //return list of all products in DB
        public static List<Product> getAllProducts()
        {
            DBservices dbs = new DBservices();
            return dbs.getAllProducts();
        }

        //return list of products by category in DB
        public static List<Product> getProductsByCategory(string category)
        {
            DBservices dbs = new DBservices();
            return dbs.getProductsByCategory(category);
        }

        //return list of all products that have specific tag
        public static List<Product> getProductsByTag(string tag)
        {
            DBservices dbs = new DBservices();
            return dbs.getProductsByTag(tag);
        }

        //return product details
        public static Product getProductById(int id)
        {
            DBservices dbs = new DBservices();
            return dbs.getProductById(id);
        }

        //UPDATE
        //return the updated product
        public static Product updateProduct(Product updatedProduct)
        {
            DBservices dbs = new DBservices();
            return dbs.updateProduct(updatedProduct);
        }

        //DELET
        //return the true if product was deleted, flase if not
        public static bool deleteProduct(int id)
        {
            DBservices dbs = new DBservices();
            return dbs.deleteProduct(id);
        }

    }
}