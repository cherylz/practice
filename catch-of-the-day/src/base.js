import Rebase from 're-base'; // a specific package. allows us to mirror our state to our firebase changes. it's like a React firebase
import firebase from 'firebase'; // use it for anything that is not mirroring the state. when we set up rebase, we actually have to pass our firebase

// we need to configure our application
//we need to go back to firebase, go to Database, create database in Realtime Database, choose the test mode (the Rules are read true and write true. obviously, you are not gonna do that in a production application, we'll come back for it.)
// under DEVELOP, things we'll use: AUthentication, Database.
// copy and paste our config from firebase
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDW8nD-T1y2gu--os-eQjtvo7lnm9WFHtQ",
    authDomain: "catch-of-the-day-yu.firebaseapp.com",
    databaseURL: "https://catch-of-the-day-yu.firebaseio.com",
    /* we won't use the following
    projectId: "catch-of-the-day-yu",
    storageBucket: "catch-of-the-day-yu.appspot.com",
    messagingSenderId: "1068665068353"
    */
  });

// then we need to create our Rebase
// .database is a function that will return the actual database we have
const base = Rebase.createClass(firebaseApp.database());

// to recap, we've created two things: firebase app, and our rebase binding. then we need to export them.

// This is a named export, we knew what it's called. Another example: how we import { formatPrice } from helper.js
export { firebaseApp };

// This is a default export. So the main thing that gets exported from this base.js config file is the base we created with Rebase
export default base;

// Now we need to go back to App.js to mirror our fish state to our firebase. And in order to do that, we need to wait till this App component is on the page and then we'll start to sync them up. This is where Lifecycle Methods come in. 
