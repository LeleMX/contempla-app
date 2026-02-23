import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore";

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

async function cleanClients() {
    try {
        const clientsRef = collection(db, "clients");
        const snapshot = await getDocs(clientsRef);

        for (const document of snapshot.docs) {
            if (document.id !== "prueba@example.com") {
                await deleteDoc(doc(db, "clients", document.id));
                console.log(`Deleted client: ${document.id}`);
            }
        }

        // Asegurarse de que el usuario de prueba exista
        const testDocRef = doc(db, "clients", "prueba@example.com");
        await setDoc(testDocRef, {
            email: "prueba@example.com",
            visits: 1,
            // Usamos una fecha antigua y segura para que pueda hacer check-in inmediatamente si quiere.
            lastVisitAt: Date.now() - (48 * 60 * 60 * 1000)
        });

        console.log("-----------------------------------------");
        console.log("✅ Database cleaned. Only prueba@example.com remains.");
        process.exit(0);
    } catch (err) {
        console.error("Failed to clean up db", err);
        process.exit(1);
    }
}

cleanClients();
