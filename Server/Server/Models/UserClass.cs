namespace Server.Models
{
    public class UserClass
    {
        public int id { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        public string phone { get; set; }
        public string address { get; set; }
        public DateTime regDate { get; set; }


        //return list of all users
        static public List<UserClass> getAllUsers()
        {
            DBservices dbs = new DBservices();
            return dbs.getAllUsers();
        }

        //return list of all user's favorite products
        public static List<Product> getProductsByUser(int userId)
        {
            DBservices dbs = new DBservices();
            return dbs.getProductsByUser(userId);
        }

        //return User object after registration or null if it failed
        public UserClass Register()
        {

            DBservices dbs = new DBservices();
            return dbs.Register(this);
        }

        // return User object of forgotten password
        public static UserClass getUserDetailsByEmail(string email)
        {
            DBservices dbs = new DBservices();
            UserClass u = dbs.getUserDetailsByEmail(email);
            if (u == null)
            {
                throw new Exception("Email Not Exist");
            }
            else
                return u;
        }

        //return User object after logging or null if it failed
        public UserClass Login()
        {
            DBservices dbs = new DBservices();
            int res = dbs.FindUser(this.email);
            if (res == 0)
                throw new Exception("Email Not Exists.");
            else
            {
                UserClass u = dbs.checkUserPassword(this.email, this.password);
                if (u == null)
                {
                    throw new Exception("Invalid password attempt.");
                }
                else
                    return u;
            }
        }

        //return True if product added to user favorite products and False if no
        public static bool addProductToFav(int userId, int prodId)
        {
            DBservices dbs = new DBservices();
            return dbs.addProductToFav(userId, prodId);
        }

        //return True if product removed from user favorite products and False if no
        public static bool deleteProductFromFav(int userId, int prodId)
        {
            DBservices dbs = new DBservices();
            return dbs.deleteProductFromFav(userId, prodId);
        }

        //return User object after updated details
        public UserClass updateUserDetails()
        {
            DBservices dbs = new DBservices();
            return dbs.updateUserDetails(this);
        }

        //return list of top 5 users by the total order price
        public static List<UserClass> getTop5()
        {
            DBservices dbs = new DBservices();
            return dbs.getTop5();
        }

        //return true if user deleted from DB and false if it failed
        public static bool deleteUser(int userId)
        {
            DBservices dbs = new DBservices();
            return dbs.deleteUser(userId);
        }

        public static UserClass getUserDetails(int userId)
        {
            DBservices dbs = new DBservices();
            return dbs.getUserDetails(userId);
        }

        public static List<Order> getUserOrders(int userId)
        {
            DBservices dbs = new DBservices();
            return dbs.getUserOrders(userId);
        }
    }
}
