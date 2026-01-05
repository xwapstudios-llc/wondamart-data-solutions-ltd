"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import the functions you need from the SDKs you need
const app_1 = require("firebase/app");
// import { getAnalytics } from "firebase/analytics";
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCgir0Wxgs3BbWIAHrh5JTrozDMIYeuR-E",
    authDomain: "wondamart-data-solutions-ltd.firebaseapp.com",
    projectId: "wondamart-data-solutions-ltd",
    storageBucket: "wondamart-data-solutions-ltd.firebasestorage.app",
    messagingSenderId: "930673735196",
    appId: "1:930673735196:web:a6a7a752f7aa1b30e351d9",
};
// Initialize Firebase
const app = (0, app_1.initializeApp)(firebaseConfig);
// const analytics = getAnalytics(app);
exports.default = app;
//# sourceMappingURL=app.js.map