// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // ✅ Correct module
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAb0jUkRUQmIPhboSN3IEErpKzCxb1jwS8",
  authDomain: "mern-blog-390f5.firebaseapp.com",
  projectId: "mern-blog-390f5",
  storageBucket: "mern-blog-390f5.firebasestorage.app",
  messagingSenderId: "190506230423",
  appId: "1:190506230423:web:14a0d23972ef0d4cbc3fd2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };
