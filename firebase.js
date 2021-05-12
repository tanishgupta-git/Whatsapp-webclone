import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyCYAIxlJQSisJ2iVkL5IW2SPC9OATmO_8U",
    authDomain: "whatsapp-71507.firebaseapp.com",
    projectId: "whatsapp-71507",
    storageBucket: "whatsapp-71507.appspot.com",
    messagingSenderId: "37117719629",
    appId: "1:37117719629:web:59a7626b53b37b47aad804"
  };

// we are doing this becuase next.js uses server side rendering so we have to protect ourselves if
// already a app has been initialized
const app =  !firebase.apps.length 
  ? firebase.initializeApp(firebaseConfig) 
  : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db,auth,provider };