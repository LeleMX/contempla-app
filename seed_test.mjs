import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDe6p2LXGtA3GewuO5dVTY0TMRgbyy5yqM",
    authDomain: "contempla-app.firebaseapp.com",
    projectId: "contempla-app",
    storageBucket: "contempla-app.firebasestorage.app",
    messagingSenderId: "444753192597",
    appId: "1:444753192597:web:9158739bdaea195bf79d9c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedTestClient() {
    try {
        const email = "premio@example.com";
        const twoDaysAgo = Date.now() - (48 * 60 * 60 * 1000);

        await setDoc(doc(db, "clients", email), {
            email: email,
            visits: 9,
            lastVisitAt: twoDaysAgo
        });
        console.log("Seeded test client 'premio@example.com' with 9 visits and eligible time.");
        process.exit(0);
    } catch (e) {
        console.error("Error seeding:", e);
        process.exit(1);
    }
}

seedTestClient();
