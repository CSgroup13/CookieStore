using System.Data.SqlClient;
using System.Data;
using Server.Models;
using System.Collections.Generic;

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

    public List<Order> getUserOrders(int userId)
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
        cmd = CreateCommandWithStoredProcedure("SP_getUserOrders", con, paramDic);// create the command

        List<Order> OrdersList = new List<Order>();

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                Order o = new Order();
                o.id = Convert.ToInt32(dataReader["id"]);
                o.userId = Convert.ToInt32(dataReader["userId"]);
                o.totalPrice = Convert.ToDouble(dataReader["totalPrice"]);
                o.date = Convert.ToDateTime(dataReader["date"]);
                o.shippingAddress = dataReader["shippingAddress"].ToString();
                o.notes = dataReader["notes"].ToString();
                o.status = (Order.Status)dataReader["status"];
                o.shippingMethod = (Order.ShippingMethod)dataReader["shippingMethod"];
                o.paymentMethod = (Order.PaymentMethod)dataReader["paymentMethod"];

                // Fetch order items for the current order
                List<OrderItem> orderItems = getOrderItemsByOrderId(o.id);
                o.orderItems = orderItems;

                OrdersList.Add(o);
            }
            return OrdersList;
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

    // Create a method to fetch order items by order ID
    public List<OrderItem> getOrderItemsByOrderId(int orderId)
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
        paramDic.Add("@orderId", orderId);
        cmd = CreateCommandWithStoredProcedure("SP_getOrderItemsByOrderId", con, paramDic);// create the command

        List<OrderItem> orderItems = new List<OrderItem>();

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                OrderItem item = new OrderItem();
                item.id = Convert.ToInt32(dataReader["id"]);
                item.productId = Convert.ToInt32(dataReader["productId"]);
                item.quantity = Convert.ToInt32(dataReader["quantity"]);

                orderItems.Add(item);
            }
            return orderItems;
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
    // This method returns user details by his userId
    //--------------------------------------------------------------------------------------------------
    public UserClass getUserDetails(int userId)
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

        cmd = CreateCommandWithStoredProcedure("SP_getUserDetails", con, paramDic);
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
            throw new Exception("User with this id does not exist");
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
    // This method returns user details by his email
    //--------------------------------------------------------------------------------------------------
    public UserClass getUserDetailsByEmail(string email)
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

        cmd = CreateCommandWithStoredProcedure("SP_getUserDetailsByEmail", con, paramDic);
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
                u.id = Convert.ToInt32(dataReader["id"].ToString());
                u.firstName = dataReader["firstName"].ToString();
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
                u.password = dataReader["password"].ToString();
                u.phone = dataReader["phone"].ToString();
                u.address = dataReader["address"].ToString();
                u.regDate = Convert.ToDateTime(dataReader["regDate"]);
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

        paramDic.Add("@name", p.name);
        paramDic.Add("@price", p.price);
        paramDic.Add("@description", p.description);
        paramDic.Add("@rate", p.rate);
        paramDic.Add("@image", p.image);

        string ingredientsString = string.Join(",", p.ingredients); // Converts List to a comma-separated string
        paramDic.Add("@ingredients", ingredientsString);

        cmd = CreateCommandWithStoredProcedure("SP_addProduct", con, paramDic);// create the command

        try
        {
            SqlParameter outputIdParam = new SqlParameter("@ProductId", SqlDbType.Int);
            outputIdParam.Direction = ParameterDirection.Output;
            cmd.Parameters.Add(outputIdParam);

            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            if (numEffected == 1)
            {
                // Set the ID of the product object
                p.id = Convert.ToInt32(cmd.Parameters["@ProductId"].Value);
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
    // This method Reads 8 best sellers products
    //--------------------------------------------------------------------------------------------------
    public List<Product> getBestSellers()
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


        cmd = CreateCommandWithStoredProcedure("SP_getBestSellers", con, null);// create the command


        List<Product> products = new List<Product>();

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
            while (dataReader.Read())
            {
                Product p = new Product();
                p.id = Convert.ToInt32(dataReader["id"]);
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
    public List<Product> getProductsByCategory(int categoryId)
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
        paramDic.Add("@categoryId", categoryId);
        cmd = CreateCommandWithStoredProcedure("SP_getProductsByCategory", con, paramDic);// create the command


        List<Product> products = new List<Product>();

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
            while (dataReader.Read())
            {
                Product p = new Product();
                p.id = Convert.ToInt32(dataReader["Id"]);
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
            if (products.Count() > 0)
                return products;
            throw new Exception("could not find Category.");
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
        paramDic.Add("@name", p.name);
        paramDic.Add("@price", p.price);
        string ingredientsString = string.Join(",", p.ingredients); // Converts List to a comma-separated string
        paramDic.Add("@ingredients", ingredientsString);
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

    //*****************************************************Category Methods*********************************************************************************
    //--------------------------------------------------------------------------------------------------
    // This method add new category to db
    //--------------------------------------------------------------------------------------------------
    public Category addCategory(Category c)
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

        paramDic.Add("@name", c.name);
        paramDic.Add("@description", c.description);

        cmd = CreateCommandWithStoredProcedure("SP_addCategory", con, paramDic);// create the command

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            if (numEffected == 1)
            {
                return c;
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
    // This method connect add category and product to productCategories table
    //--------------------------------------------------------------------------------------------------
    public bool addProductToCategory(int categoryId, int productId)
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

        paramDic.Add("@categoryId", categoryId);
        paramDic.Add("@productId", productId);

        cmd = CreateCommandWithStoredProcedure("SP_addProductToCategory", con, paramDic);// create the command

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
    // This method Reads all categories
    //--------------------------------------------------------------------------------------------------
    public List<Category> getAllCategories()
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


        cmd = CreateCommandWithStoredProcedure("SP_getAllCategories", con, null);// create the command


        List<Category> categories = new List<Category>();

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
            while (dataReader.Read())
            {
                Category c = new Category();
                c.id = Convert.ToInt32(dataReader["id"]);
                c.name = dataReader["name"].ToString();
                c.description = dataReader["description"].ToString();

                categories.Add(c);
            }
            return categories;
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
    // This method return category by id
    //--------------------------------------------------------------------------------------------------
    public Category getCategoryById(int id)
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

        cmd = CreateCommandWithStoredProcedure("SP_getCategoryById", con, paramDic);// create the command


        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
            if (dataReader.Read())
            {
                Category c = new Category();
                c.id = Convert.ToInt32(dataReader["Id"]);
                c.name = dataReader["name"].ToString();
                c.description = dataReader["description"].ToString();

                return c;
            }
            throw new Exception("could not find Category");
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
    // This method update category in db
    //--------------------------------------------------------------------------------------------------
    public Category updateCategory(Category c)
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

        paramDic.Add("@id", c.id);
        paramDic.Add("@name", c.name);
        paramDic.Add("@description", c.description);

        cmd = CreateCommandWithStoredProcedure("SP_updateCategory", con, paramDic);// create the command

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            if (numEffected == 1)
            {
                return c;
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
    // This method delete a category from categoriesTable
    //--------------------------------------------------------------------------------------------------
    public bool deleteCategory(int id)
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
        cmd = CreateCommandWithStoredProcedure("SP_deleteCategory", con, paramDic);// create the command

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

    //*****************************************************Order Methods*********************************************************************************
    //--------------------------------------------------------------------------------------------------
    // This method add new orderItem to db
    //--------------------------------------------------------------------------------------------------
    public bool addOrderItem(Order o)
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
        try
        {
            foreach (var orderItem in o.orderItems)
            {
                Dictionary<string, object> paramDic = new Dictionary<string, object>();
                paramDic.Add("@orderId", o.id);
                paramDic.Add("@productId", orderItem.productId);
                paramDic.Add("@quantity", orderItem.quantity);
                cmd = CreateCommandWithStoredProcedure("SP_addOrderItem", con, paramDic);// create the command

                int numEffected = cmd.ExecuteNonQuery(); // execute the command
                if (numEffected != 1)
                {
                    throw new Exception($"{orderItem.productId} does not exist");
                }
            }
            return true;
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

    public Order addOrder(Order o)
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

        // Add parameters for the stored procedure if needed
        paramDic.Add("@userId", o.userId);
        paramDic.Add("@totalPrice", o.totalPrice);
        paramDic.Add("@date", o.date);
        paramDic.Add("@shippingAddress", o.shippingAddress);
        paramDic.Add("@shippingMethod", (int)o.shippingMethod);
        paramDic.Add("@paymentMethod", (int)o.paymentMethod);
        paramDic.Add("@notes", o.notes);
        paramDic.Add("@status", (int)o.status);

        cmd = CreateCommandWithStoredProcedure("SP_addOrder", con, paramDic);// create the command
        try
        {
            SqlParameter outputIdParam = new SqlParameter("@OrderId", SqlDbType.Int);
            outputIdParam.Direction = ParameterDirection.Output;
            cmd.Parameters.Add(outputIdParam);

            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            if (numEffected == 1)
            {
                // Set the ID of the product object
                o.id = Convert.ToInt32(cmd.Parameters["@OrderId"].Value);
                addOrderItem(o);
                return o;
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
    // This method Reads all orders
    //--------------------------------------------------------------------------------------------------
    public List<Order> getAllOrders()
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


        cmd = CreateCommandWithStoredProcedure("SP_getAllOrders", con, null);// create the command


        List<Order> orders = new List<Order>();

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
            while (dataReader.Read())
            {
                Order o = new Order();
                o.id = Convert.ToInt32(dataReader["id"]);
                o.userId = Convert.ToInt32(dataReader["userId"]);
                o.totalPrice = Convert.ToDouble(dataReader["totalPrice"]);
                o.date = Convert.ToDateTime(dataReader["date"]);
                o.shippingAddress = dataReader["shippingAddress"].ToString();
                o.notes = dataReader["notes"].ToString();
                o.status = (Order.Status)dataReader["status"];
                o.shippingMethod = (Order.ShippingMethod)dataReader["shippingMethod"];
                o.paymentMethod = (Order.PaymentMethod)dataReader["paymentMethod"];
                o.orderItems = getOrderItems(o.id);

                orders.Add(o);
            }
            return orders;
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
    // This method return order by id
    //--------------------------------------------------------------------------------------------------
    public Order getOrderById(int id)
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

        cmd = CreateCommandWithStoredProcedure("SP_getOrderById", con, paramDic);// create the command

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
            if (dataReader.Read())
            {
                Order o = new Order();
                o.id = Convert.ToInt32(dataReader["id"]);
                o.userId = Convert.ToInt32(dataReader["userId"]);
                o.totalPrice = Convert.ToDouble(dataReader["totalPrice"]);
                o.date = Convert.ToDateTime(dataReader["date"]);
                o.shippingAddress = dataReader["shippingAddress"].ToString();
                o.notes = dataReader["notes"].ToString();
                o.status = (Order.Status)dataReader["status"];
                o.shippingMethod = (Order.ShippingMethod)dataReader["shippingMethod"];
                o.paymentMethod = (Order.PaymentMethod)dataReader["paymentMethod"];
                o.orderItems = getOrderItems(o.id);

                return o;
            }
            throw new Exception("could not find Order");
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
    // This method Reads all order items
    //--------------------------------------------------------------------------------------------------
    public List<OrderItem> getOrderItems(int orderId)
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
        paramDic.Add("@orderId", orderId);
        cmd = CreateCommandWithStoredProcedure("SP_getOrderItems", con, paramDic);// create the command


        List<OrderItem> orderItems = new List<OrderItem>();

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
            while (dataReader.Read())
            {
                OrderItem oi = new OrderItem();
                oi.id = Convert.ToInt32(dataReader["id"]);
                oi.orderId = Convert.ToInt32(dataReader["orderId"]);
                oi.productId = Convert.ToInt32(dataReader["productId"]);
                oi.quantity = Convert.ToInt32(dataReader["quantity"]);
                orderItems.Add(oi);
            }
            return orderItems;
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
    // This method update order in db
    //--------------------------------------------------------------------------------------------------
    public Order updateOrder(Order o)
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

        paramDic.Add("@id", o.id);
        paramDic.Add("@userId", o.userId);
        paramDic.Add("@totalPrice", o.totalPrice);
        paramDic.Add("@date", o.date);
        paramDic.Add("@shippingAddress", o.shippingAddress);
        paramDic.Add("@notes", o.notes);
        paramDic.Add("@status", (int)o.status);
        paramDic.Add("@shippingMethod", (int)o.shippingMethod);
        paramDic.Add("@paymentMethod", (int)o.paymentMethod);


        cmd = CreateCommandWithStoredProcedure("SP_updateOrder", con, paramDic);// create the command

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            if (numEffected == 1)
            {
                return o;
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
    // This method delete order from ordersTable
    //--------------------------------------------------------------------------------------------------
    public bool deleteOrder(int id)
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
        cmd = CreateCommandWithStoredProcedure("SP_deleteOrder", con, paramDic);// create the command

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