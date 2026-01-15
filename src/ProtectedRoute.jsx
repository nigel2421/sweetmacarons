
import { Navigate } from 'react-router-dom';
import { auth } from './firebase';

const ProtectedRoute = ({ isAuthenticated, adminOnly, children }) => {
  const user = auth.currentUser;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.email !== 'lostresmacarons@gmail.com') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
