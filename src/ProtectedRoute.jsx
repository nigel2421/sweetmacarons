import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { checkIsAdmin } from './admin';

const ProtectedRoute = ({ user, adminOnly, children }) => {
  const [isAdmin, setIsAdmin] = useState(adminOnly ? null : true);

  useEffect(() => {
    if (adminOnly && user) {
      checkIsAdmin(user).then(res => setIsAdmin(res));
    }
  }, [user, adminOnly]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && isAdmin === null) {
    return <div className="loading-screen">Verifying privileges...</div>;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
