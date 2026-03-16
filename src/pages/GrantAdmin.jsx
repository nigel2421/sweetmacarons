import React, { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth } from 'firebase/auth';

const GrantAdmin = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleGrantAdmin = async () => {
    setMessage('');
    setError('');
    try {
      const functions = getFunctions();
      const grantAdminRole = httpsCallable(functions, 'grantAdminRole');
      const result = await grantAdminRole({ email: 'lostresmacarons@gmail.com' });
      setMessage(result.data.message);

      // Force a token refresh to get the new custom claim
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        await user.getIdToken(true);
      }

      setMessage(result.data.message + ' Token refreshed. You should now have admin access.');

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Grant Admin Role</h2>
      <p>
        Click the button below to grant admin privileges to the user with the
        email 'lostresmacarons@gmail.com'. You must be logged in as this user
        to grant the role.
      </p>
      <button onClick={handleGrantAdmin}>Grant Admin Role</button>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default GrantAdmin;
