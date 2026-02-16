const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();

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
