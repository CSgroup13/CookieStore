﻿using Microsoft.AspNetCore.Mvc;
using Server.Models;


namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        //add order to DB
        // POST api/<OrderController>
        [HttpPost]
        public IActionResult addOrder([FromBody] Order order)
        {
            try
            {
                return Ok(order.addOrder());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //get all orders
        // GET: api/<OrderController>
        [HttpGet]
        public IActionResult getAllOrders()
        {
            try
            {
                return Ok(Order.getAllOrders());
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        //get order
        // GET: api/<OrderController>
        [HttpGet("order/{id}")]
        public IActionResult getOrderById(int id)
        {
            try
            {
                return Ok(Order.getOrderById(id));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //update order
        // PUT api/<OrderController>
        [HttpPut("updateOrder")]
        public IActionResult updateOrder([FromBody] Order updatedOrder)
        {
            try
            {
                return Ok(Order.updateOrder(updatedOrder));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //delete order
        // DELETE api/<OrderController>
        [HttpDelete("deleteOrder/{id}")]
        public IActionResult deleteOrder(int id)
        {
            try
            {
                return Ok(Order.deleteOrder(id));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
