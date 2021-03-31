import * as firebase from "firebase";

var firebaseConfig = {
    apiKey: 'AIzaSyBNV8N-1fuHqQFJXtcMWSSg6BAUv2JLlG8',
    authDomain: 'storeapp1-ea810.firebaseapp.com',
    databaseURL: 'https://storeapp1-ea810.firebaseio.com',
    projectId: 'storeapp1-ea810',
    storageBucket: 'storeapp1-ea810.appspot.com',
    messagingSenderId: '529946008622',
    appId: '1:529946008622:web:7eaa8efcadd7aa4de113bf',
    measurementId: 'G-FD4T4X8TRP',
};

// if(!firebase.app().length){
    firebase.initializeApp(firebaseConfig);
// }
export default firebase;
