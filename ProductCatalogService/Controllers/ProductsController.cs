using System.Collections.Generic;
using System.Web.Http;
using ProductCatalogService.Models;

namespace ProductCatalogService.Controllers
{
    public class ProductsController : ApiController
    {
        // Simulación de datos duros
        private static List<Product> products = new List<Product>
        {
            new Product { Id = 1, Name = "Product 1", Price = 10.5, Description = "Description of Product 1" },
            new Product { Id = 2, Name = "Product 2", Price = 15.75, Description = "Description of Product 2" }
        };

        // GET api/products
        public IHttpActionResult Get()
        {
            return Ok(products);
        }

        // GET api/products/5
        public IHttpActionResult Get(int id)
        {
            var product = products.Find(p => p.Id == id);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }

        // POST api/products
        public IHttpActionResult Post(Product product)
        {
            product.Id = products.Count + 1; // Simulación de ID automático
            products.Add(product);
            return CreatedAtRoute("DefaultApi", new { id = product.Id }, product);
        }

        // PUT api/products/5
        public IHttpActionResult Put(int id, Product product)
        {
            var existingProduct = products.Find(p => p.Id == id);
            if (existingProduct == null)
            {
                return NotFound();
            }
            existingProduct.Name = product.Name;
            existingProduct.Price = product.Price;
            existingProduct.Description = product.Description;
            return Ok(existingProduct);
        }

        // DELETE api/products/5
        public IHttpActionResult Delete(int id)
        {
            var product = products.Find(p => p.Id == id);
            if (product == null)
            {
                return NotFound();
            }
            products.Remove(product);
            return Ok(product);
        }
    }
}
