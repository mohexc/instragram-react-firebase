import * as firebase from 'firebase/app'
import "firebase/storage"
import "firebase/firestore"

var firebaseConfig = {
    apiKey: process.env.REACT_APP_APIKEY,
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    databaseURL: process.env.REACT_APP_DATABASEURL,
    projectId: process.env.REACT_APP_PROJECTID,
    storageBucket: process.env.REACT_APP_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
    appId: process.env.REACT_APP_APPID,
    measurementId: process.env.REACT_APP_MEASUREMENTID,

}
firebase.initializeApp(firebaseConfig)

const db = firebase.firestore();
const storage = firebase.storage()
// const auth = firebaseApp.auth()
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export { db, storage, timestamp, };