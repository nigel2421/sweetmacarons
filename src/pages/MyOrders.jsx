
import Orders from './Orders';

const MyOrders = ({ orders, isAdmin, user, onLogout, onReorder }) => {
  return <Orders orders={orders} isAdmin={isAdmin} onLogout={onLogout} onReorder={onReorder} />;
};

export default MyOrders;
