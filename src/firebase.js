import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBOLSoXhJ70UkNzF6l5G8oEN7zb1PAC96g",
  authDomain: "instagram-clone-by-raghib.firebaseapp.com",
  databaseURL: "https://instagram-clone-by-raghib.firebaseio.com",
  projectId: "instagram-clone-by-raghib",
  storageBucket: "instagram-clone-by-raghib.appspot.com",
  messagingSenderId: "18170301297",
  appId: "1:18170301297:web:a9ebed98e3130eabe384d0",
  measurementId: "G-V814TXHXL5",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
export { db, auth, storage };
