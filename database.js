import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

import {
	FIREBASE_APPID,
	FIREBASE_APIKEY,
	FIREBASE_AUTHDOMAIN,
	FIREBASE_STORAGE_BUCKET,
	FIREBASE_MESSAGING_SENDERID,
	FIREBASE_PROJECT_ID,
	FIREBASE_DATABASE_URL,
} from '@env';

const firebaseConfig = {
	apiKey: FIREBASE_APIKEY,
	authDomain: FIREBASE_AUTHDOMAIN,
	databaseURL: FIREBASE_DATABASE_URL,
	projectId: FIREBASE_PROJECT_ID,
	messagingSenderId: FIREBASE_MESSAGING_SENDERID,
	storageBucket: FIREBASE_STORAGE_BUCKET,
	appId: FIREBASE_APPID,
};
// Ini

let app;
if (firebase.apps.length === 0) {
	app = firebase.initializeApp(firebaseConfig);
} else {
	app = firebase.app();
}

const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

export { db, storage, auth };
