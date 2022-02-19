
  import firebase from "firebase";
  import "firebase/auth";
  import "firebase/firestore";
  import "firebase/database";
  import "firebase/messaging";
  import "firebase/storage";

const firebaseConfig={};

  const firebaseApp=firebase.initializeApp({// For Firebase JS SDK v7.20.0 and later, measurementId is optional
      apiKey: "AIzaSyDOQU6LNZ1h01MvBtVsI_Y97UXiNhuo7Kw",
      authDomain: "socialnet-3f453.firebaseapp.com",
      databaseURL: "https://socialnet-3f453-default-rtdb.firebaseio.com",
      projectId: "socialnet-3f453",
      storageBucket: "socialnet-3f453.appspot.com",
      messagingSenderId: "834262451101",
      appId: "1:834262451101:web:4ddad026efa27988ed6574",
      measurementId: "G-QFCX5WXMHR"

  });
  const db=firebaseapp.firestore();
  const db2=firebaseApp.database();
  const auth=Firebase.auth();
  const storage=Firebase.storage();
  const provider=new firebase.auth.GoogleAuthProvider();
  const createTimestamp=firebase.firestore.FieldValue.serverTimestamp;
  const createTimestamp2=firebase.database.ServerValue.TIMESTAMP;
  const fieldIncrement = firebase.firestore.FieldValue.increment;
  const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
  const storage = firebase.storage().ref("images");
  const audioStorage = firebase.storage().ref("audios");const messaging = "serviceWorker" in navigator &&
   "PushManager" in window ?  firebase.messaging() : null;



  export { loadFirebase,auth,provider,createTimestamp,messaging,fieldIncrement,arrayUnion,storage ,audioStorage,db2,createTimestamp2};
  export default db;
