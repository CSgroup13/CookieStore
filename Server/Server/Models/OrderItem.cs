namespace Server.Models
{
    public class OrderItem
    {
        public int id { get; set; }
        public int orderId { get; set; }
        public int productId { get; set; } 
        public int quantity { get; set; }

        //// Navigation properties
        //public Order order { get; set; } // Represents the parent order
        //public Product product { get; set; } // Represents the associated product
    }
}
