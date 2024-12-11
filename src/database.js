import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDRu2DWXPN2g92QOTnSONhEbq4m7z7SjH4",
    authDomain: "matching-game-81f97.firebaseapp.com",
    projectId: "matching-game-81f97",
    storageBucket: "matching-game-81f97.firebasestorage.app",
    messagingSenderId: "595639797585",
    appId: "1:595639797585:web:f879f3a9ab97fafa47f570",
    measurementId: "G-RBCF92418S",
};

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

export const insertGame = async (game) => {
    try{
        const docRef = await addDoc(collection(database, 'games'), {
            player: game.player,
            difficulty: game.difficulty,
            hasWon: game.hasWon,
            points: game.points,
            totalPoints: game.totalPoints,
            time: game.time,
            date: game.date
        });
        console.log(docRef);
    }catch (e){
        console.log(e);
    }
};

export const getRecentGames = async () => {
    const gamesArray = [];
    const gamesQuery = query(collection(database, 'games'), orderBy('date', 'desc'), limit(5));
    const games = await getDocs(gamesQuery);
    games.forEach((game) => {
        gamesArray.push(game.data());
    });
    return gamesArray;
};

export const getGames = async () => {
    const gamesArray = [];
    const gamesQuery = query(collection(database, 'games'), orderBy('date', 'desc'));
    const games = await getDocs(gamesQuery);
    games.forEach((game) => {
        gamesArray.push(game.data());
    });
    return gamesArray;
};