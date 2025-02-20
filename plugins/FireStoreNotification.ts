import { initializeApp, type FirebaseApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";

export default defineNuxtPlugin(() => {
  const config = {
    apiKey: process.env.NotapiKey,
    authDomain: process.env.NotauthDomain,
    projectId: process.env.NotprojectId,
    appId: process.env.NotappId,
    // Add other Firebase config options
  };

  const notapp = initializeApp(config,'baloot-boards');
  const notdb = getFirestore(notapp);

  return {
    provide: {
      notfirebase: notapp ,
      notfirestore: notdb ,
    },
  };
});
