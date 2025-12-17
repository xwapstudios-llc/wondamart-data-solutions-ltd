// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAUei-Afhvz4ABbdasZmpMG5gHs92TIh80",
    authDomain: "wondamart-data-solutions.firebaseapp.com",
    projectId: "wondamart-data-solutions",
    storageBucket: "wondamart-data-solutions.firebasestorage.app",
    messagingSenderId: "441830393869",
    appId: "1:441830393869:web:518fb900f8c78cc7b0ed44",
    measurementId: "G-D19PYYRQ7N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app;