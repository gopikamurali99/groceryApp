import admin from 'firebase-admin'

admin.initializeApp({
    credential: admin.credential.applicationDefault(), // This should be the service account key from Firebase
    databaseURL: "https://grocery-app-2a6ca-default-rtdb.firebaseio.com" // Replace with your Firebase project's database URL
  });
  
export default admin;


