
import { Navigate } from 'react-router-dom';
import { auth } from './firebase';

const ProtectedRoute = ({ user, adminOnly, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.email !== 'lostresmacarons@gmail.com') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
