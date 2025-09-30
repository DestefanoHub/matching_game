import type { Difficulty, GameData, MultiGamesData, SortBy, WinLoss, Game } from './types';

const baseURL = 'http://localhost:3100/';

export async function getGameInfo(gameId: string): Promise<GameData> {
    const response = await fetch(`${baseURL}getGameInfo/${gameId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    if(response.status !== 200){
        return {};
    }

    return await response.json();
};

export async function getRecentGames(): Promise<Game[]> {
    const response = await fetch(`${baseURL}getRecentGames`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    if(response.status !== 200){
        return [];
    }

    return await response.json();
};

export async function getGames(player: string, winLoss: WinLoss, diff: Difficulty, sortBy: SortBy, page: number): Promise<MultiGamesData> {
    const queryParams = new URLSearchParams();
    const gamesData = {
        games: [],
        totalGames: 0
    };

    queryParams.append('player', player);
    queryParams.append('winLoss', winLoss);
    queryParams.append('diff', diff.toString());
    queryParams.append('sortBy', sortBy);
    queryParams.append('page', page.toString());
    
    const response = await fetch(`${baseURL}getGames?${queryParams}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    if(response.status !== 200){
        return gamesData;
    }

    const history = await response.json();
    gamesData.games = history.games;
    gamesData.totalGames = history.totalGames;

    return gamesData;
};

export async function saveGame(player: string, difficulty: Difficulty, hasWon: boolean, points: number, totalPoints: number, time: number): Promise<GameData> {
    const response = await fetch(`${baseURL}saveGame`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            player,
            difficulty,
            hasWon,
            points,
            totalPoints,
            time: 60 - time,
        })
    });

    return await response.json();
};