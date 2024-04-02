using Microsoft.AspNetCore.Mvc;
using Server.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SongsServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        //add product to DB
        // POST api/<ProductController>
        [HttpPost]
        public IActionResult addProduct([FromBody] Product product)
        {
            try
            {
                return Ok(product.addProduct());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //get all products
        // GET: api/<ProductController>
        [HttpGet]
        public IActionResult getAllProducts()
        {
            try
            {
                return Ok(Product.getAllProducts());
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        //get products by category
        // GET: api/<ProductController>/category
        [HttpGet("category/{category}")]
        public IActionResult getProductsByCategory(int categoryId)
        {
            try
            {
                return Ok(Product.getProductsByCategory(categoryId));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //get product
        // GET: api/<ProductController>
        [HttpGet("product/{id}")]
        public IActionResult getProductById(int id)
        {
            try
            {
                return Ok(Product.getProductById(id));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //update product
        // POST api/<SongsController>
        [HttpPut("updateProduct")]
        public IActionResult updateProduct([FromBody] Product updatedProduct)
        {
            try
            {
                return Ok(Product.updateProduct(updatedProduct));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //delete product
        // DELETE api/<SongsController>
        [HttpDelete("deleteProduct/{id}")]
        public IActionResult deleteProduct(int id)
        {
            try
            {
                return Ok(Product.deleteProduct(id));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
