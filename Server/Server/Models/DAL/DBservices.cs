using System.Data.SqlClient;
using System.Data;
using Server.Models;

/// <summary>
/// DBServices is a class created by me to provides some DataBase Services
/// </summary>
public class DBservices
{

    public DBservices()
    {
        //
        // TODO: Add constructor logic here
        //
    }

    //--------------------------------------------------------------------------------------------------
    // This method creates a connection to the database according to the connectionString name in the web.config 
    //--------------------------------------------------------------------------------------------------
    public SqlConnection connect(string conString)
    {
        try
        {
            // read the connection string from the configuration file
            IConfigurationRoot configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json").Build();
            string cStr = configuration.GetConnectionString("myProjDB");
            SqlConnection con = new SqlConnection(cStr);
            con.Open();
            return con;
        }
        catch (Exception e)
        {
            throw new Exception("Error in DB");
        }
    }

    //---------------------------------------------------------------------------------
    // Create the SqlCommand using a stored procedure
    //---------------------------------------------------------------------------------
    private SqlCommand CreateCommandWithStoredProcedure(string spName, SqlConnection con, Dictionary<string, object> paramDic)
    {
        try
        {
            SqlCommand cmd = new SqlCommand(); // create the command object

            cmd.Connection = con;              // assign the connection to the command object

            cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

            cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

            cmd.CommandType = CommandType.StoredProcedure; // the type of the command, can also be text

            if (paramDic != null)
                foreach (KeyValuePair<string, object> param in paramDic)
                {
                    cmd.Parameters.AddWithValue(param.Key, param.Value);

                }


            return cmd;
        }
        catch (Exception e)
        {
            throw new Exception("Error in DB");
        }
    }

    //**********************************************************************Users Methods*********************************************************************************

    //--------------------------------------------------------------------------------------------------
    // This method reads all users
    //--------------------------------------------------------------------------------------------------
    public List<UserClass> getAllUsers()
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            throw (ex);
        }


        cmd = CreateCommandWithStoredProcedure("SP_getAllUsers", con, null);             // create the command


        List<UserClass> usersList = new List<UserClass>();

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                UserClass u = new UserClass();
                u.id = Convert.ToInt32(dataReader["id"]);
                u.firstName = dataReader["firstName"].ToString();
                u.lastName = dataReader["lastName"].ToString();
                u.email = dataReader["email"].ToString();
                u.password = dataReader["password"].ToString();
                u.phone = dataReader["phone"].ToString();
                u.address = dataReader["address"].ToString();
                u.regDate = Convert.ToDateTime(dataReader["regDate"]);
                usersList.Add(u);
            }
            return usersList;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }
    //--------------------------------------------------------------------------------------------------
    // This method return top 5 users by total order price
    //--------------------------------------------------------------------------------------------------
    public List<UserClass> getTop5()
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            throw (ex);
        }


        cmd = CreateCommandWithStoredProcedure("SP_GetTop5", con, null);             // create the command


        List<UserClass> usersList = new List<UserClass>();

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                UserClass u = new UserClass();
                u.firstName = dataReader["name"].ToString();
                u.lastName = dataReader["lastName"].ToString();
                usersList.Add(u);
            }
            return usersList;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }
    //--------------------------------------------------------------------------------------------------
    // This method reads all products of specific user favorite products
    //--------------------------------------------------------------------------------------------------
    public List<Product> getProductsByUser(int userId)
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@userId", userId);
        cmd = CreateCommandWithStoredProcedure("SP_getProductsByUser", con, paramDic);// create the command

        List<Product> productsList = new List<Product>();

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                Product p = new Product();
                p.id = Convert.ToInt32(dataReader["Id"]);
                p.category = dataReader["category"].ToString();
                p.name = dataReader["name"].ToString();
                p.price = Convert.ToDouble(dataReader["price"]);
                p.description = dataReader["description"].ToString();
                p.rate = Convert.ToInt32(dataReader["rate"]);
                p.image = dataReader["image"].ToString();

                // Convert ingredients to a list of strings
                string ingredientsString = dataReader["ingredients"].ToString();
                char[] ingredientDelimiter = { ',' }; // Assuming ingredients are separated by commas
                string[] ingredientsArray = ingredientsString.Split(ingredientDelimiter, StringSplitOptions.RemoveEmptyEntries);
                p.ingredients = new List<string>(ingredientsArray);

                productsList.Add(p);
            }
            return productsList;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }


    //--------------------------------------------------------------------------------------------------
    // This method Inserts a new User to the Users table 
    //--------------------------------------------------------------------------------------------------
    public UserClass Register(UserClass user)
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@firstName", user.firstName);
        paramDic.Add("@lastName", user.lastName);
        paramDic.Add("@email", user.email);
        paramDic.Add("@password", user.password);
        paramDic.Add("@phone", user.phone);
        paramDic.Add("@address", user.address);
        paramDic.Add("@regDate", user.regDate);


        cmd = CreateCommandWithStoredProcedure("SP_Register", con, paramDic);             // create the command

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            if (dataReader.Read())
            {
                UserClass u = new UserClass();
                u.id = Convert.ToInt32(dataReader["id"]);
                u.firstName = dataReader["firstName"].ToString();
                u.lastName = dataReader["lastName"].ToString();
                u.email = dataReader["email"].ToString();
                u.password = dataReader["password"].ToString();
                u.phone = dataReader["phone"].ToString();
                u.address = dataReader["address"].ToString();
                u.regDate = Convert.ToDateTime(dataReader["regDate"]);
                return u;
            }
            throw new Exception("User with this email is already exits.");
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }

    //--------------------------------------------------------------------------------------------------
    // This method updates User details
    //--------------------------------------------------------------------------------------------------
    public UserClass updateUserDetails(UserClass user)
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();

        paramDic.Add("@id", user.id);
        paramDic.Add("@firstName", user.firstName);
        paramDic.Add("@lastName", user.lastName);
        paramDic.Add("@email", user.email);
        paramDic.Add("@password", user.password);
        paramDic.Add("@phone", user.phone);
        paramDic.Add("@address", user.address);
        paramDic.Add("@regDate", user.regDate);


        cmd = CreateCommandWithStoredProcedure("SP_UpdateUserDetails", con, paramDic);             // create the command

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            if (dataReader.Read())
            {
                UserClass u = new UserClass();
                u.id = Convert.ToInt32(dataReader["id"]);
                u.firstName = dataReader["firstName"].ToString();
                u.lastName = dataReader["lastName"].ToString();
                u.email = dataReader["email"].ToString();
                u.password = dataReader["password"].ToString();
                u.phone = dataReader["phone"].ToString();
                u.address = dataReader["address"].ToString();
                u.regDate = Convert.ToDateTime(dataReader["regDate"]);
                return u;
            }
            throw new Exception("User with this email is already exits.");
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }
    //--------------------------------------------------------------------------------------------------
    // This method deletes User
    //--------------------------------------------------------------------------------------------------
    public bool deleteUser(int userId)
    {
        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();

        paramDic.Add("@id", userId);


        cmd = CreateCommandWithStoredProcedure("SP_DeleteUser", con, paramDic);// create the command

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected > 0;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }
    //--------------------------------------------------------------------------------------------------
    // This method Check If Exists User by Email
    //--------------------------------------------------------------------------------------------------
    public int FindUser(string email)
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@email", email);

        cmd = CreateCommandWithStoredProcedure("SP_FindUser", con, paramDic);             // create the command
        var returnParameter = cmd.Parameters.Add("@returnValue", SqlDbType.Int);
        returnParameter.Direction = ParameterDirection.ReturnValue;

        try
        {
            cmd.ExecuteNonQuery(); // execute the command
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
        return (int)returnParameter.Value;
    }

    //--------------------------------------------------------------------------------------------------
    // This method Check If user password is valid
    //--------------------------------------------------------------------------------------------------
    public UserClass checkUserPassword(string email, string password)
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@email", email);
        paramDic.Add("@password", password);

        cmd = CreateCommandWithStoredProcedure("SP_checkUserPassword", con, paramDic);
        UserClass u = new UserClass();
        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
            if (dataReader.Read())
            {
                u.id = Convert.ToInt32(dataReader["id"]);
                u.firstName = dataReader["firstName"].ToString();
                u.lastName = dataReader["lastName"].ToString();
                u.email = dataReader["email"].ToString();
                return u;
            }
            return null;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }

    //--------------------------------------------------------------------------------------------------
    // This method Insert a product to userProducts table(favorite products)
    //--------------------------------------------------------------------------------------------------
    public bool addProductToFav(int userId, int productId)
    {
        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();

        paramDic.Add("@userId", userId);
        paramDic.Add("@productId", productId);

        cmd = CreateCommandWithStoredProcedure("SP_addProdToFav", con, paramDic);// create the command

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected > 0;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }

    //--------------------------------------------------------------------------------------------------
    // This method Delete a product from userProducts table
    //--------------------------------------------------------------------------------------------------
    public bool deleteProductFromFav(int userId, int productId)
    {
        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();

        paramDic.Add("@userId", userId);
        paramDic.Add("@productId", productId);

        cmd = CreateCommandWithStoredProcedure("SP_deleteProdFromFav", con, paramDic);// create the command

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected > 0;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }


    //*****************************************************Product Methods*********************************************************************************
    //--------------------------------------------------------------------------------------------------
    // This method add new product to db
    //--------------------------------------------------------------------------------------------------
    public Product addProduct(Product p)
    {
        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();

        paramDic.Add("@category", p.category);
        paramDic.Add("@name", p.name);
        paramDic.Add("@price", p.price);
        paramDic.Add("@ingredients", p.ingredients);
        paramDic.Add("@description", p.description);
        paramDic.Add("@rate", p.rate);
        paramDic.Add("@image", p.image);


        cmd = CreateCommandWithStoredProcedure("SP_addProduct", con, paramDic);// create the command

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            if (numEffected == 1)
            {
                return p;
            }
            return null;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }

    //--------------------------------------------------------------------------------------------------
    // This method Reads all products
    //--------------------------------------------------------------------------------------------------
    public List<Product> getAllProducts()
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }


        cmd = CreateCommandWithStoredProcedure("SP_getAllProducts", con, null);// create the command


        List<Product> products = new List<Product>();

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
            while (dataReader.Read())
            {
                Product p = new Product();
                p.id = Convert.ToInt32(dataReader["id"]);
                p.category = dataReader["category"].ToString();
                p.name = dataReader["name"].ToString();
                p.price = Convert.ToDouble(dataReader["price"]);
                p.description = dataReader["description"].ToString();
                p.rate = Convert.ToInt32(dataReader["rate"]);
                p.image = dataReader["image"].ToString();

                // Convert ingredients to a list of strings
                string ingredientsString = dataReader["ingredients"].ToString();
                char[] ingredientDelimiter = { ',' }; // Assuming ingredients are separated by commas
                string[] ingredientsArray = ingredientsString.Split(ingredientDelimiter, StringSplitOptions.RemoveEmptyEntries);
                p.ingredients = new List<string>(ingredientsArray);

                products.Add(p);
            }
            return products;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }

    //--------------------------------------------------------------------------------------------------
    // This method Reads all products by specific category
    //--------------------------------------------------------------------------------------------------
    public List<Product> getProductsByCategory(string category)
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }


        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@category", category);
        cmd = CreateCommandWithStoredProcedure("SP_getProductsByCategory", con, paramDic);// create the command


        List<Product> products = new List<Product>();

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
            while (dataReader.Read())
            {
                Product p = new Product();
                p.id = Convert.ToInt32(dataReader["Id"]);
                p.category = dataReader["category"].ToString();
                p.name = dataReader["name"].ToString();
                p.price = Convert.ToDouble(dataReader["price"]);
                p.description = dataReader["description"].ToString();
                p.rate = Convert.ToInt32(dataReader["rate"]);
                p.image = dataReader["image"].ToString();

                // Convert ingredients to a list of strings
                string ingredientsString = dataReader["ingredients"].ToString();
                char[] ingredientDelimiter = { ',' }; // Assuming ingredients are separated by commas
                string[] ingredientsArray = ingredientsString.Split(ingredientDelimiter, StringSplitOptions.RemoveEmptyEntries);
                p.ingredients = new List<string>(ingredientsArray);

                products.Add(p);
            }
            return products;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }

    //--------------------------------------------------------------------------------------------------
    // This method return product by id
    //--------------------------------------------------------------------------------------------------
    public Product getProductById(int id)
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }
        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@id", id);

        cmd = CreateCommandWithStoredProcedure("SP_getProductById", con, paramDic);// create the command


        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
            if (dataReader.Read())
            {
                Product p = new Product();
                p.id = Convert.ToInt32(dataReader["Id"]);
                p.category = dataReader["category"].ToString();
                p.name = dataReader["name"].ToString();
                p.price = Convert.ToDouble(dataReader["price"]);
                p.description = dataReader["description"].ToString();
                p.rate = Convert.ToInt32(dataReader["rate"]);
                p.image = dataReader["image"].ToString();

                // Convert ingredients to a list of strings
                string ingredientsString = dataReader["ingredients"].ToString();
                char[] ingredientDelimiter = { ',' }; // Assuming ingredients are separated by commas
                string[] ingredientsArray = ingredientsString.Split(ingredientDelimiter, StringSplitOptions.RemoveEmptyEntries);
                p.ingredients = new List<string>(ingredientsArray);

                return p;
            }
            throw new Exception("could not find Product");
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }


    //--------------------------------------------------------------------------------------------------
    // This method update product in db
    //--------------------------------------------------------------------------------------------------
    public Product updateProduct(Product p)
    {
        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();

        paramDic.Add("@id", p.id);
        paramDic.Add("@category", p.category);
        paramDic.Add("@name", p.name);
        paramDic.Add("@price", p.price);
        paramDic.Add("@ingredients", p.ingredients);
        paramDic.Add("@description", p.description);
        paramDic.Add("@rate", p.rate);
        paramDic.Add("@image", p.image);


        cmd = CreateCommandWithStoredProcedure("SP_updateProduct", con, paramDic);// create the command

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            if (numEffected == 1)
            {
                return p;
            }
            return null;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }

    //--------------------------------------------------------------------------------------------------
    // This method delete a product from productsTable
    //--------------------------------------------------------------------------------------------------
    public bool deleteProduct(int id)
    {
        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();

        paramDic.Add("@id", id);
        cmd = CreateCommandWithStoredProcedure("SP_deleteProduct", con, paramDic);// create the command

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected == 1;
        }
        catch (Exception ex)
        {
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                con.Close();
            }
        }

    }
}

//    //*****************************************************Artists Methods*********************************************************************************
//    //--------------------------------------------------------------------------------------------------
//    // This method return random artist
//    //--------------------------------------------------------------------------------------------------
//    public Order getRandomArtist()
//    {

//        SqlConnection con;
//        SqlCommand cmd;

//        try
//        {
//            con = connect("myProjDB"); // create the connection
//        }
//        catch (Exception ex)
//        {
//            Console.WriteLine(ex.Message);
//            throw (ex);
//        }


//        cmd = CreateCommandWithStoredProcedure("SP_getRandomArtist", con, null);// create the command
//        try
//        {
//            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

//            if (dataReader.Read())
//            {
//                Order a = new Order();
//                a.id = Convert.ToInt32(dataReader["id"]);
//                a.name = dataReader["name"].ToString();
//                a.rate = Convert.ToInt32(dataReader["rate"]);
//                a.image = dataReader["image"].ToString();

//                return a;
//            }
//            throw new Exception("couldn't get Random artist");
//        }
//        catch (Exception ex)
//        {
//            Console.WriteLine(ex.Message);
//            throw (ex);
//        }

//        finally
//        {
//            if (con != null)
//            {
//                // close the db connection
//                con.Close();
//            }
//        }

//    }

//    //--------------------------------------------------------------------------------------------------
//    // This method return 3 random songs that are different from input value
//    //--------------------------------------------------------------------------------------------------
//    public List<Order> getDiffRandomArtists(String artistName)
//    {

//        SqlConnection con;
//        SqlCommand cmd;

//        try
//        {
//            con = connect("myProjDB"); // create the connection
//        }
//        catch (Exception ex)
//        {
//            // write to log
//            throw (ex);
//        }


//        Dictionary<string, object> paramDic = new Dictionary<string, object>();
//        paramDic.Add("@artistName", artistName);

//        cmd = CreateCommandWithStoredProcedure("SP_getDiffRandomArtists", con, paramDic);// create the command

//        List<Order> artistsList = new List<Order>();

//        try
//        {
//            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
//            while (dataReader.Read())
//            {
//                Order a = new Order();
//                a.id = Convert.ToInt32(dataReader["Id"]);
//                a.name = dataReader["name"].ToString();
//                a.rate = Convert.ToInt32(dataReader["rate"]);
//                a.image = dataReader["image"].ToString();
//                artistsList.Add(a);
//            }
//            return artistsList;
//        }
//        catch (Exception ex)
//        {
//            // write to log
//            throw (ex);
//        }

//        finally
//        {
//            if (con != null)
//            {
//                // close the db connection
//                con.Close();
//            }
//        }

//    }

//    //--------------------------------------------------------------------------------------------------
//    // This method return artist by id
//    //--------------------------------------------------------------------------------------------------
//    public Order getArtistById(int id)
//    {

//        SqlConnection con;
//        SqlCommand cmd;

//        try
//        {
//            con = connect("myProjDB"); // create the connection
//        }
//        catch (Exception ex)
//        {
//            // write to log
//            throw (ex);
//        }
//        Dictionary<string, object> paramDic = new Dictionary<string, object>();

//        paramDic.Add("@id", id);


//        cmd = CreateCommandWithStoredProcedure("SP_getArtistById", con, paramDic);// create the command


//        try
//        {
//            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
//            if (dataReader.Read())
//            {
//                Order a = new Order();
//                a.id = Convert.ToInt32(dataReader["id"]);
//                a.name = dataReader["name"].ToString();
//                a.rate = Convert.ToInt32(dataReader["rate"]);
//                a.image = dataReader["image"].ToString();

//                return a;
//            }
//            throw new Exception("could not find Artist");
//        }
//        catch (Exception ex)
//        {
//            // write to log
//            throw (ex);
//        }

//        finally
//        {
//            if (con != null)
//            {
//                // close the db connection
//                con.Close();
//            }
//        }

//    }

//    //--------------------------------------------------------------------------------------------------
//    // This method return artist by Name
//    //--------------------------------------------------------------------------------------------------
//    public List<Order> getArtistByName(string artistName)
//    {

//        SqlConnection con;
//        SqlCommand cmd;

//        try
//        {
//            con = connect("myProjDB"); // create the connection
//        }
//        catch (Exception ex)
//        {
//            // write to log
//            throw (ex);
//        }
//        Dictionary<string, object> paramDic = new Dictionary<string, object>();

//        paramDic.Add("@name", artistName);


//        cmd = CreateCommandWithStoredProcedure("SP_getArtistByName", con, paramDic);// create the command

//        List<Order> artistsList = new List<Order>();
//        try
//        {
//            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
//            while (dataReader.Read())
//            {
//                Order a = new Order();
//                a.id = Convert.ToInt32(dataReader["id"]);
//                a.name = dataReader["name"].ToString();
//                a.rate = Convert.ToInt32(dataReader["rate"]);
//                a.image = dataReader["image"].ToString();
//                artistsList.Add(a);
//            }
//            return artistsList;
//            throw new Exception("could not find Artist");
//        }
//        catch (Exception ex)
//        {
//            // write to log
//            throw (ex);
//        }

//        finally
//        {
//            if (con != null)
//            {
//                // close the db connection
//                con.Close();
//            }
//        }

//    }

//    //--------------------------------------------------------------------------------------------------
//    // This method Returns all Artists
//    //--------------------------------------------------------------------------------------------------
//    public List<Order> getAllArtists()
//    {

//        SqlConnection con;
//        SqlCommand cmd;

//        try
//        {
//            con = connect("myProjDB"); // create the connection
//        }
//        catch (Exception ex)
//        {
//            // write to log
//            throw (ex);
//        }


//        cmd = CreateCommandWithStoredProcedure("SP_getAllArtists", con, null);// create the command


//        List<Order> artistList = new List<Order>();

//        try
//        {
//            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
//            while (dataReader.Read())
//            {
//                Order a = new Order();
//                a.id = Convert.ToInt32(dataReader["Id"]);
//                a.name = dataReader["name"].ToString();
//                a.rate = Convert.ToInt32(dataReader["rate"]);
//                a.image = dataReader["image"].ToString();
//                artistList.Add(a);
//            }
//            return artistList;
//        }
//        catch (Exception ex)
//        {
//            // write to log
//            throw (ex);
//        }

//        finally
//        {
//            if (con != null)
//            {
//                // close the db connection
//                con.Close();
//            }
//        }

//    }

//    //--------------------------------------------------------------------------------------------------
//    // This method return songs by artist
//    //--------------------------------------------------------------------------------------------------
//    public List<Product> getSongsByArtist(string artistName)
//    {
//        SqlConnection con;
//        SqlCommand cmd;

//        try
//        {
//            con = connect("myProjDB"); // create the connection
//        }
//        catch (Exception ex)
//        {
//            // write to log
//            throw (ex);
//        }

//        Dictionary<string, object> paramDic = new Dictionary<string, object>();
//        paramDic.Add("@artistName", artistName);

//        cmd = CreateCommandWithStoredProcedure("SP_getSongsByArtist", con, paramDic);// create the command


//        List<Product> songList = new List<Product>();

//        try
//        {
//            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
//            while (dataReader.Read())
//            {
//                Product s = new Product();
//                s.id = Convert.ToInt32(dataReader["id"]);
//                s.name = dataReader["name"].ToString();
//                s.artistName = dataReader["artistName"].ToString();
//                s.link = dataReader["link"].ToString();
//                s.lyrics = dataReader["lyrics"].ToString();
//                s.rate = Convert.ToInt32(dataReader["rate"]);
//                s.image = dataReader["image"].ToString();
//                songList.Add(s);
//            }
//            if (songList.Count > 0)
//            {
//                return songList;
//            }
//            throw new Exception("No Songs from this Artist");
//        }
//        catch (Exception ex)
//        {
//            // write to log
//            throw (ex);
//        }

//        finally
//        {
//            if (con != null)
//            {
//                // close the db connection
//                con.Close();
//            }
//        }
//    }
//    //--------------------------------------------------------------------------------------------------
//    // This method return song by different artist
//    //--------------------------------------------------------------------------------------------------
//    public Product getSongByDiffArtist(string artistName)
//    {
//        SqlConnection con;
//        SqlCommand cmd;

//        try
//        {
//            con = connect("myProjDB"); // create the connection
//        }
//        catch (Exception ex)
//        {
//            // write to log
//            throw (ex);
//        }

//        Dictionary<string, object> paramDic = new Dictionary<string, object>();
//        paramDic.Add("@artistName", artistName);

//        cmd = CreateCommandWithStoredProcedure("SP_getDiffArtistSong", con, paramDic);// create the command

//        try
//        {
//            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
//            if (dataReader.Read())
//            {
//                Product s = new Product();
//                s.id = Convert.ToInt32(dataReader["id"]);
//                s.name = dataReader["name"].ToString();
//                s.artistName = dataReader["artistName"].ToString();
//                s.link = dataReader["link"].ToString();
//                s.lyrics = dataReader["lyrics"].ToString();
//                s.rate = Convert.ToInt32(dataReader["rate"]);
//                s.image = dataReader["image"].ToString();
//                return s;
//            }

//            throw new Exception("No Song from this Different Artist");
//        }
//        catch (Exception ex)
//        {
//            // write to log
//            throw (ex);
//        }

//        finally
//        {
//            if (con != null)
//            {
//                // close the db connection
//                con.Close();
//            }
//        }
//    }
//}