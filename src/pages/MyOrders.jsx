
import Orders from './Orders';

const MyOrders = ({ onLogout, onReorder }) => {
  return <Orders onLogout={onLogout} onReorder={onReorder} />;
};

export default MyOrders;
