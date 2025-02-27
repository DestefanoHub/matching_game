import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from "firebase/firestore";

import config from './firebaseConfig.json';

const firebaseConfig = config;

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