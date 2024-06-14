using OrderManagementService.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace OrderManagementService.Controllers
{
    public class OrdersController : ApiController
    {
        private static List<Order> orders = new List<Order>()
        {
            //new Order
            //{
            //    Id = 1,
            //    CustomerName = "John Doe",
            //    OrderDate = DateTime.UtcNow,
            //    Items = new List<OrderItem>
            //    {
            //        new OrderItem { ProductId = 1, ProductName = "Product A", Quantity = 2, Price = 50.0 },
            //        new OrderItem { ProductId = 2, ProductName = "Product B", Quantity = 1, Price = 100.0 }
            //    }
            //},
            //new Order
            //{
            //    Id = 2,
            //    CustomerName = "Jane Smith",
            //    OrderDate = DateTime.UtcNow,
            //    Items = new List<OrderItem>
            //    {
            //        new OrderItem { ProductId = 3, ProductName = "Product C", Quantity = 3, Price = 75.0 }
            //    }
            //}
        };

        // GET: api/Orders
        public IHttpActionResult Get()
        {
            return Ok(orders);
        }

        // GET: api/Orders/1
        public IHttpActionResult Get(int id)
        {
            var order = orders.FirstOrDefault(o => o.Id == id);
            if (order == null)
            {
                return NotFound();
            }
            return Ok(order);
        }

        // POST: api/Orders
        public IHttpActionResult Post([FromBody] Order order)
        {
            if (order == null)
            {
                return BadRequest("Order cannot be null.");
            }

            order.Id = orders.Count + 1;
            order.Status = "Created";
            orders.Add(order);

            return Created(new Uri(Request.RequestUri + "/" + order.Id), order);
        }

        // PUT: api/Orders/1
        public IHttpActionResult Put(int id, [FromBody] Order order)
        {
            var existingOrder = orders.FirstOrDefault(o => o.Id == id);
            if (existingOrder == null)
            {
                return NotFound();
            }

            existingOrder.Status = order.Status;

            return Ok(existingOrder);
        }

        // DELETE: api/Orders/1
        public IHttpActionResult Delete(int id)
        {
            var order = orders.FirstOrDefault(o => o.Id == id);
            if (order == null)
            {
                return NotFound();
            }

            orders.Remove(order);

            return Ok(order);
        }
    }
}
