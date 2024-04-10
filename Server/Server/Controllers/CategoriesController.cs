using Microsoft.AspNetCore.Mvc;
using Server.Models;


namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        //get all categories
        // GET: api/<CategoryController>
        [HttpGet]
        public IActionResult getAllCategories()
        {
            try
            {
                return Ok(Category.getAllCategories());
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }
        //get how many cookies sold per category
        [HttpGet("GetCookiesSumCategory")]
        public IActionResult GetCookiesSumCategory()
        {
            try
            {
                return Ok(Category.GetCookiesSumCategory());
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }
        //add category to DB
        // POST api/<CategoryController>
        [HttpPost]
        public IActionResult addCategory([FromBody] Category category)
        {
            try
            {
                return Ok(category.addCategory());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        //get category details
        // GET: api/<CategoryController>
        [HttpGet("categoryDetails/{id}")]
        public IActionResult getCategoryById(int id)
        {
            try
            {
                return Ok(Category.getCategoryById(id));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //update category
        // POST api/<CategoryController>
        [HttpPut("updateCategory")]
        public IActionResult updateCategory([FromBody] Category updatedCategory)
        {
            try
            {
                return Ok(Category.updateCategory(updatedCategory));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //delete category
        // DELETE api/<CategoryController>
        [HttpDelete("deleteCategory/{id}")]
        public IActionResult deleteCategory(int id)
        {
            try
            {
                return Ok(Category.deleteCategory(id));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //add category to DB
        // POST api/<CategoryController>
        [HttpPost("addProductToCategory")]
        public IActionResult addProductToCategory(int categoryId, int productId)
        {
            try
            {
                return Ok(Category.addProductToCategory(categoryId, productId));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
