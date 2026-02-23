import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, writeBatch } from "firebase/firestore";

// Configuración leída de app.config.ts (Firebase config original)
const firebaseConfig = {
    projectId: "contempla-app",
    appId: "1:563584335869:web:1584c04f98df36db49de5a",
    storageBucket: "contempla-app.firebasestorage.app",
    messagingSenderId: "563584335869",
    authDomain: "contempla-app.firebaseapp.com",
};

const dummyMenu = [
    {
        name: "Latte Macchiato Vainilla",
        description: "Espresso suave con leche cremosa al vapor y un toque dulce de jarabe de vainilla genuina.",
        category: "Bebidas Calientes",
        price: 3.50,
        imageUrl: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
        name: "Cappuccino Italiano Clásico",
        description: "Equilibrio perfecto entre espresso intenso, leche vaporizada y una gruesa capa de espuma sedosa.",
        category: "Bebidas Calientes",
        price: 3.00,
        imageUrl: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
        name: "Frappé Mocha Oscuro",
        description: "Bebida helada mezclada con café, salsa de chocolate oscuro, leche y hielo, cubierta con crema batida.",
        category: "Bebidas Frías",
        price: 4.25,
        imageUrl: "https://images.pexels.com/photos/1170659/pexels-photo-1170659.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
        name: "Croissant de Almendras Artesanal",
        description: "Masa hojaldrada mantequillosa horneada en casa, rellena y cubierta con crema de almendras tostadas.",
        category: "Postres",
        price: 2.75,
        imageUrl: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
        name: "Iced Caramel Macchiato",
        description: "Leche fría vertida sobre hielo, manchada con espresso rico y finalizada con una llovizna de caramelo.",
        category: "Bebidas Frías",
        price: 3.80,
        imageUrl: "https://images.pexels.com/photos/2059/restaurant-person-woman-coffee.jpg?auto=compress&cs=tinysrgb&w=800"
    }
];

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedDatabase() {
    console.log("Iniciando inyección de menú...");
    const menuCollection = collection(db, "menu_items");

    console.log("Leyendo items viejos para borrar...");
    const oldSnippets = await getDocs(menuCollection);
    const batch = writeBatch(db);

    oldSnippets.forEach((doc) => {
        batch.delete(doc.ref);
    });

    if (oldSnippets.size > 0) {
        await batch.commit();
        console.log(`Se borraron ${oldSnippets.size} items antiguos del menú.`);
    }

    console.log("Insertando nuevos productos con imágenes...");
    let count = 0;
    for (const item of dummyMenu) {
        try {
            await addDoc(menuCollection, item);
            count++;
            console.log(`Insertado: ${item.name}`);
        } catch (e) {
            console.error(`Error al insertar ${item.name}:`, e);
        }
    }

    console.log(`¡Inyección completada exitosamente! ${count} items añadidos.`);
    process.exit(0);
}

seedDatabase();
