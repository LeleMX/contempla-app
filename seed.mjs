import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

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

async function seedDatabase() {
    console.log('Seeding database with test data...');

    const testClients = [
        { email: 'juan.perez@example.com', visits: 5 },
        { email: 'maria.garcia@example.com', visits: 2 },
        { email: 'carlos.lopez@example.com', visits: 12 },
        { email: 'ana.martinez@example.com', visits: 1 },
        { email: 'luis.rodriguez@example.com', visits: 8 }
    ];

    try {
        for (const client of testClients) {
            const docRef = doc(db, 'clients', client.email);
            await setDoc(docRef, {
                email: client.email,
                visits: client.visits
            });
            console.log(`Added client: ${client.email}`);
        }
        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

seedDatabase();
