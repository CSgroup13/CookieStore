namespace Server.Models
{
    public class Category
    {
        public int id { get; set; }
        public string name { get; set; }
        public string description { get; set; }

        //CREATE
        //return Category object after added or null if it failed
        public Category addCategory()
        {
            DBservices dbs = new DBservices();
            return dbs.addCategory(this);
        }

        //return true if succeed, else flase
        public static bool addProductToCategory(int categoryId, int productId)
        {
            DBservices dbs = new DBservices();
            return dbs.addProductToCategory(categoryId, productId);
        }

        //READ
        //return list of all categories in DB
        public static List<Category> getAllCategories()
        {
            DBservices dbs = new DBservices();
            return dbs.getAllCategories();
        }

        //return category details
        public static Category getCategoryById(int id)
        {
            DBservices dbs = new DBservices();
            return dbs.getCategoryById(id);
        }

        //UPDATE
        //return the updated category
        public static Category updateCategory(Category updatedCategory)
        {
            DBservices dbs = new DBservices();
            return dbs.updateCategory(updatedCategory);
        }

        //DELET
        //return the true if category was deleted, flase if not
        public static bool deleteCategory(int id)
        {
            DBservices dbs = new DBservices();
            return dbs.deleteCategory(id);
        }

    }
}
