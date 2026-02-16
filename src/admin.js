export const adminEmails = ['lostresmacarons@gmail.com'];

/**
 * Checks if a user has admin privileges.
 * @param {import('firebase/auth').User} user 
 * @returns {Promise<boolean>}
 */
export const checkIsAdmin = async (user) => {
    if (!user) return false;

    // Check hardcoded list first
    if (adminEmails.includes(user.email)) return true;

    // Check custom claims (e.g., set via Cloud Functions)
    try {
        const idTokenResult = await user.getIdTokenResult();
        return !!idTokenResult.claims.admin;
    } catch (error) {
        console.error("Error checking admin claims:", error);
        return false;
    }
};
