const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();

// New function to grant admin role
exports.grantAdminRole = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'You must be logged in to grant admin roles.');
  }

  // Security check: Only the specified email can be made an admin through this function.
  const targetEmail = request.data.email;
  if (targetEmail !== 'lostresmacarons@gmail.com') {
     throw new HttpsError('permission-denied', 'This function can only be used to make lostresmacarons@gmail.com an admin.');
  }

  // The caller must be the user they are trying to make an admin.
  if (request.auth.token.email !== targetEmail) {
      throw new HttpsError('permission-denied', 'You can only grant admin role to yourself.');
  }

  try {
    const user = await admin.auth().getUserByEmail(targetEmail);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    return { message: `Success! ${targetEmail} has been made an admin.` };
  } catch (error) {
    console.error("Error setting custom claim:", error);
    throw new HttpsError('internal', 'An internal error occurred while setting the admin claim.');
  }
});


exports.listUsers = onCall(async (request) => {
  // Check for authentication and admin privileges
  if (!request.auth || request.auth.token.admin !== true) {
    // Throw an HttpsError to the client
    throw new HttpsError(
      'permission-denied',
      'Request not authorized. User must be an admin to fulfill this request.'
    );
  }

  try {
    const listUsersResult = await admin.auth().listUsers();
    // .toJSON() provides a serializable object for each user
    const users = listUsersResult.users.map((userRecord) => userRecord.toJSON());
    return { users };
  } catch (error) {
    console.error("Error listing users:", error);
    // Throw a generic internal error to the client
    throw new HttpsError('internal', 'An internal error occurred while listing users.');
  }
});
