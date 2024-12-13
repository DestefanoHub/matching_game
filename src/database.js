import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, startAfter, limit, getCountFromServer } from "firebase/firestore";

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

export const getRecentGames = async () => {
    const gamesArray = [];
    const gamesQuery = query(collection(database, 'games'), orderBy('date', 'desc'), limit(5));
    const games = await getDocs(gamesQuery);
    games.forEach((game) => {
        gamesArray.push(game.data());
    });
    return gamesArray;
};

export const getGames = async (player, winLoss, diff, sort, page=1) => {
    const gamesArray = [];
    const recordsPerPage = 10;
    let gamesQuery = collection(database, 'games');
    
    //optional player search
    if(player.length){
        gamesQuery = query(gamesQuery, where('player', '==', player));
    }

    //required win/loss filter
    switch(winLoss){
        case 'w': {
            gamesQuery = query(gamesQuery, where('hasWon', '==', true));
            break;
        }
        case 'l': {
            gamesQuery = query(gamesQuery, where('hasWon', '==', false));
            break;
        }
        case 'a':
        default:
            break;
    }

    //required difficulty filter
    if(diff !== 0){
        gamesQuery = query(gamesQuery, where('difficulty', '==', diff));
    }

    //required sort and order
    switch(sort){
        case 'sd': {
            gamesQuery = query(gamesQuery, orderBy('points', 'desc'));
            break;
        }
        case 'sa': {
            gamesQuery = query(gamesQuery, orderBy('points', 'asc'));
            break;
        }
        case 'da': {
            gamesQuery = query(gamesQuery, orderBy('date', 'asc'));
            break;
        }
        case 'dd':
        default: {
            gamesQuery = query(gamesQuery, orderBy('date', 'desc'));
            break;
        }
    }

    //get total number of filtered games
    const totalGamesQuery = await getCountFromServer(gamesQuery);
    const totalGames = totalGamesQuery.data().count;

    //pagination - ten records per page
    if(page === 1){
        gamesQuery = query(gamesQuery, limit(recordsPerPage));
    }else{
        const previousRecords = (page * recordsPerPage) - recordsPerPage;
        gamesQuery = query(gamesQuery, limit(previousRecords));
        const pageSetup = await getDocs(gamesQuery);
        const lastRecord = pageSetup.docs[pageSetup.docs.length - 1];
        gamesQuery = query(gamesQuery, startAfter(lastRecord), limit(recordsPerPage));
    }
    
    const games = await getDocs(gamesQuery);
    games.forEach((game) => {
        gamesArray.push(game.data());
    });

    return {
        games: gamesArray,
        totalGames: totalGames
    };
};