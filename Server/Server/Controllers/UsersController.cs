using Microsoft.AspNetCore.Mvc;
using Server.Models;


namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        //get all users
        // GET: api/<UsersController>/
        [HttpGet]
        public List<UserClass> getAllUsers()
        {
            return UserClass.getAllUsers();
        }

        //get user details
        // GET: api/<UsersController>/
        [HttpGet("{userId}/userDetails")]
        public IActionResult getUserDetails(int userId)
        {
            try
            {
                return Ok(UserClass.getUserDetails(userId));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        //get all favorite products of user by user id
        // GET: api/<UsersController>/
        [HttpGet("{userId}/products")]
        public List<Product> getProductsByUser(int userId)
        {
            return UserClass.getProductsByUser(userId);
        }

        //get all user orders by user id
        // GET: api/<UsersController>/
        [HttpGet("{userId}/orders")]
        public List<Order> getUserOrders(int userId)
        {
            return UserClass.getUserOrders(userId);
        }


        //post User object to DB while registration
        // POST api/<UsersController>/register
        [HttpPost("register")]
        public IActionResult Register([FromBody] UserClass u)
        {
            try
            {
                return Ok(u.Register());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        //post User object (email and password) to DB while logging
        // POST api/<UsersController>/login
        [HttpPost("login")]
        public IActionResult Login([FromBody] UserClass u)
        {
            try
            {
                return Ok(u.Login());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        //post for adding product to favorites of user
        // POST api/<UsersController>
        [HttpPost("{userId}/{prodId}")]
        public IActionResult addProductToFav(int userId, int prodId)
        {
            if (UserClass.addProductToFav(userId, prodId))
                return Ok(true);
            return BadRequest("Product is already in favorites");
        }

        //delete product from user's favorite products
        // DELETE api/<UsersController>/5
        [HttpDelete("{userId}/{prodId}")]
        public IActionResult deleteProductFromFav(int userId, int prodId)
        {
            if (UserClass.deleteProductFromFav(userId, prodId))
                return Ok(true);
            return BadRequest("Product is not in favorites");
        }

        //update user details (by admin)
        // POST api/<UsersController>/register
        [HttpPut("update")]
        public IActionResult updateUserDetails([FromBody] UserClass u)
        {
            try
            {
                return Ok(u.updateUserDetails());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        //get top 5 of users by users total order price
        // GET: api/<UsersController>/leaders
        [HttpGet("leaders")]
        public List<UserClass> getTop5()
        {
            return UserClass.getTop5();
        }

        //delete user(by admin)
        // DELETE api/<UsersController>/5
        [HttpDelete("remove/{userId}")]
        public IActionResult deleteUser(int userId)
        {
            if (UserClass.deleteUser(userId))
                return Ok(true);
            return BadRequest("User does not exist");
        }
    }
}
