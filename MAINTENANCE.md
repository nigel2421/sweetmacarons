# Sweet Macarons Maintenance Guide

With the deprecation of interactive Studio tools, this guide outlines how to manage, develop, and deploy the "Sweet Macarons" project using the Firebase CLI and Emulator Suite.

## 🛠️ Local Development (Emulators)

The Firebase Emulator Suite allows you to run a local version of Firebase services. This is the recommended way to develop features without affecting production data.

### Starting the Emulators
Run the following command in your terminal:
```bash
firebase emulators:start
```
Once started, you can access the **Emulator UI** at `http://localhost:4000`. This UI provides a visual interface for managing Firestore, Auth, and other services locally—similar to what was previously available in Studio.

### Using Emulators in Code
The application is already configured to detect if it's running locally and connect to the emulators if available (check `src/firebase.js`).

## 🚀 Deployment

To deploy your changes to the live site:

### Deploy Everything
```bash
firebase deploy
```

### Deploy Specific Features
- **Hosting**: `firebase deploy --only hosting`
- **Firestore Rules/Indexes**: `firebase deploy --only firestore`
- **Cloud Functions**: `firebase deploy --only functions`

## 📦 Managing Database Changes

### Firestore Rules
Security rules are located in `firestore.rules`. After modifying them, test locally with emulators, then deploy:
```bash
firebase deploy --only firestore:rules
```

### Firestore Indexes
Indexes are managed in `firestore.indexes.json`. You can also pull indexes created in the Firebase Console:
```bash
firebase firestore:indexes > firestore.indexes.json
```

## 🔒 Environment Secrets

If you need to manage sensitive keys for Cloud Functions, use the Firebase CLI:
```bash
firebase functions:secrets:set MY_SECRET_KEY
```

---

*For more details, refer to the [Firebase CLI Documentation](https://firebase.google.com/docs/cli).*
