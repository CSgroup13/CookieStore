import { initializeApp } from "firebase/app";
// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtoc0ImHh1ID8AservtJ72Aw_NlWQLWcg",
  authDomain: "cookiesaddiction-notification.firebaseapp.com",
  databaseURL:
    "https://cookiesaddiction-notification-default-rtdb.firebaseio.com/",
  projectId: "cookiesaddiction-notification",
  storageBucket: "cookiesaddiction-notification.appspot.com",
  messagingSenderId: "515244213408",
  appId: "1:515244213408:web:dedcf9979b69f8788275c5",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Initialize Realtime Database and get a reference to the service
// export const db = getDatabase(app);
