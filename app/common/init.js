// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

export default function(){

    const firebaseConfig = {
        apiKey: "AIzaSyA2zlSojjnGA3cGO85W2gUbWrm5XEIL00g",
        authDomain: "module-1-c82fc.firebaseapp.com",
        projectId: "module-1-c82fc",
        storageBucket: "module-1-c82fc.appspot.com",
        messagingSenderId: "315834752911",
        appId: "1:315834752911:web:f44bba3ef95a952bc235fa"
      }

      // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth()
    const db = getFirestore(app)

    return {auth, db}
}


