import { initializeApp, type FirebaseApp, getApps, getApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";

export default defineNuxtPlugin(() => {
  const env = useRuntimeConfig().public;
  const config = {
    apiKey: env.apiKey,
    authDomain: env.authDomain,
    projectId: env.projectId,
    appId: env.appId,
    // databaseURL: "https://streamconf-41f3c-default-rtdb.firebaseio.com",
    // storageBucket: "streamconf-41f3c.firebasestorage.app",
    // messagingSenderId: "369467920206",
  };

  const app = getApps().length < 2? initializeApp(config,"streamConf") : getApp("streamConf");
  const db = getFirestore(app);

  return {
    provide: {
      firebase: app,
      firestore: db,
    },
  };
});
