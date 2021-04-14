import * as firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import 'firebase/storage'

firebase.initializeApp({
  apiKey: 'AIzaSyBlz1clTHLvNYkX3DdLuS3NahX2-kJookQ',
  authDomain: 'babet-mihai.firebaseapp.com',
  databaseURL: 'https://babet-mihai.firebaseio.com',
  projectId: 'babet-mihai',
  storageBucket: 'babet-mihai.appspot.com',
  messagingSenderId: '897097348817',
  appId: '1:897097348817:web:907218278da2fff61077f0'
})

export default firebase