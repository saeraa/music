import firebase from "firebase/app";
import "firebase/auth"
import "firebase/firestore"
import "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyD_yfblKue4shS5Bee9YdgEbu74VCe-_9A",
  authDomain: "music-24c63.firebaseapp.com",
  projectId: "music-24c63",
  storageBucket: "music-24c63.appspot.com",
  messagingSenderId: "9194514106",
  appId: "1:9194514106:web:8579a1d05ebb2842b5c483"
};

firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()

const usersCollection = db.collection("users")
const songsCollection = db.collection("songs")
const commentsCollection = db.collection("comments")

export {
  auth, db, usersCollection, storage, songsCollection, commentsCollection
}