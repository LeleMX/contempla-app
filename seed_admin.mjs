import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

// Using real config from app.config.ts
const firebaseConfig = {
    apiKey: "AIzaSyDe6p2LXGtA3GewuO5dVTY0TMRgbyy5yqM",
    authDomain: "contempla-app.firebaseapp.com",
    projectId: "contempla-app",
    storageBucket: "contempla-app.firebasestorage.app",
    messagingSenderId: "444753192597",
    appId: "1:444753192597:web:9158739bdaea195bf79d9c",
    measurementId: "G-NFXKHBWR6T"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedAdmin() {
    console.log("Seeding superadmin user...");
    try {
        const adminRef = doc(collection(db, 'users'), 'superadmin');
        await setDoc(adminRef, {
            username: 'superadmin',
            password: 'insulina', // In a real app this should be hashed, but as requested it's plain text for this simple challenge
            role: 'admin',
            createdAt: new Date().toISOString()
        });
        console.log("Successfully created superadmin user!");
        process.exit(0);
    } catch (error) {
        console.error("Error creating user: ", error);
        process.exit(1);
    }
}

seedAdmin();
