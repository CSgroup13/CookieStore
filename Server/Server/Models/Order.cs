using static Server.Models.Order;

namespace Server.Models
{
    public class Order
    {
        public int id { get; set; }
        public int userId { get; set; }
        public double totalPrice { get; set; }
        public DateTime date { get; set; }
        public string shippingAddress { get; set; }
        public string notes { get; set; }
        public List<OrderItem> orderItems { get; set; }
        public enum Status
        {
            Pending=1,
            Processing=2,
            Shipped=3,
            Delivered=4
        }

        public enum ShippingMethod
        {
            Shipping=1,
            Pickup=2,
        }

        public enum PaymentMethod
        {
            Paypal=1,
            Cash
        }

        public Status status { get; set; }
        public ShippingMethod shippingMethod { get; set; }
        public PaymentMethod paymentMethod { get; set; }

        //CREATE
        //return Order object after added or null if it failed
        public Order addOrder()
        {
            DBservices dbs = new DBservices();
            return dbs.addOrder(this);
        }

        //return list of all orders
        public static List<Order> getAllOrders()
        {
            DBservices dbs = new DBservices();
            return dbs.getAllOrders();
        }

        //return order by its id
        public static Order getOrderById(int orderId)
        {
            DBservices dbs = new DBservices();
            return dbs.getOrderById(orderId);
        }

        //UPDATE
        //return the updated order
        public static Order updateOrder(Order updatedOrder)
        {
            DBservices dbs = new DBservices();
            return dbs.updateOrder(updatedOrder);
        }

        //DELET
        //return the true if order was deleted, flase if not
        public static bool deleteOrder(int id)
        {
            DBservices dbs = new DBservices();
            return dbs.deleteOrder(id);
        }
    }
}
