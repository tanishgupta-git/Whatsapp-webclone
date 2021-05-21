import firebase from 'firebase';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_apiKey,
    authDomain:process.env.NEXT_PUBLIC_authDomain,
    projectId:process.env.NEXT_PUBLIC_projectId,
    storageBucket:process.env.NEXT_PUBLIC_storageBucket,
    messagingSenderId:process.env.NEXT_PUBLIC_messagingSenderId,
    appId:process.env.NEXT_PUBLIC_appId
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