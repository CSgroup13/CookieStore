import { Helmet } from 'react-helmet-async';
import OrderView from 'src/sections/order/view/order-view.jsx';

// ----------------------------------------------------------------------

export default function OrdersPage() {
  return (
    <>
      <Helmet>
        <title> Admin | Orders </title>
      </Helmet>

      <OrderView />
    </>
  );
}
