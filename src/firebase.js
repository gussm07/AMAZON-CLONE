import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDEG94G55RaFR4tA7HiISBK75ZupMun-Y8",
  authDomain: "fir-a1d65.firebaseapp.com",
  projectId: "fir-a1d65",
  storageBucket: "fir-a1d65.appspot.com",
  messagingSenderId: "551177631808",
  appId: "1:551177631808:web:1f9ee5a27b1047f60007a5",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };
