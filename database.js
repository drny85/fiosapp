import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import Constants from 'expo-constants';

const {
	apiKey,
	authDomain,
	databaseURL,
	projectId,
	storageBucket,
	messagingSenderId,
	appId,
	measurementId,
} = Constants.manifest.extra;

const firebaseConfig = {
	apiKey: apiKey,
	authDomain: authDomain,
	databaseURL: databaseURL,
	projectId: projectId,
	messagingSenderId: messagingSenderId,
	storageBucket: storageBucket,
	appId: appId,
	measurementId: measurementId,
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
