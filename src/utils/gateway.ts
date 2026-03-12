import type { Difficulty, GameData, MultiGamesData, SortBy, WinLoss, Game, Player } from './types';

const baseURL = 'http://localhost:3100/';

export async function getGameInfo(gameId: string): Promise<GameData | symbol> {
    let gameData: GameData | symbol = Symbol();
    
    try{
        const response = await fetch(`${baseURL}game/getGameInfo/${gameId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        gameData = await response.json();
    }catch(error){
        console.log(error);
    }finally{
        return gameData;
    }
}

export async function getRecentGames(playerID: string | undefined): Promise<Game[][]> {
    let recentGames: Game[][] = [[]];

    try{
        const response = await fetch(`${baseURL}game/getRecentGames/${(typeof playerID === 'undefined') ? '' : playerID}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if(response.status !== 200){
            return recentGames;
        }

        recentGames = await response.json();
    }catch(error){
        console.log(error);
    }finally{
        return recentGames;
    }
}

export async function getGames(player: string, winLoss: WinLoss, diff: Difficulty, sortBy: SortBy, page: number): Promise<MultiGamesData> {
    const queryParams = new URLSearchParams();
    let gamesData: MultiGamesData = {
        games: [],
        totalGames: 0
    };

    try{
        queryParams.append('player', player);
        queryParams.append('winLoss', winLoss);
        queryParams.append('diff', diff.toString());
        queryParams.append('sortBy', sortBy);
        queryParams.append('page', page.toString());
        
        const response = await fetch(`${baseURL}game/getGames?${queryParams}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if(response.status !== 200){
            return gamesData;
        }

        gamesData = await response.json();
    }catch(error){
        console.log(error);
    }finally{
        return gamesData;
    }
}

export async function saveGame(player: Player, difficulty: Difficulty, hasWon: boolean, points: number, totalPoints: number, time: number): Promise<Response> {
    let response = new Response(null, {
        status: 500
    });
    
    try{
        response = await fetch(`${baseURL}game/saveGame`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${player.JWT}`
            },
            body: JSON.stringify({
                player: {
                    pid: player.ID,
                    username: player.username
                },
                difficulty,
                hasWon,
                points,
                totalPoints,
                time: 60 - time,
            })
        });
    }catch(error){
        console.log(error);
    }finally{
        return response;
    }
}

export async function login(username: string, password: string): Promise<Response> {
    let response = new Response(null, {
        status: 500
    });
    
    try{
        response = await fetch(`${baseURL}player/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        });
    }catch(error){
        console.log(error);
    }finally{
        return response;
    }
}

export async function createAccount(username: string, password: string, confirmPassword: string): Promise<Response> {    
    let response = new Response(null, {
        status: 500
    });
    
    try{
        response = await fetch(`${baseURL}player/createAccount`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                username,
                password,
                confirmPassword
            })
        });
    }catch(error){
        console.log(error);
    }finally{
        return response;
    }
}

export async function editAccount(token: string, password: string, confirmPassword: string): Promise<Response> {    
    let response = new Response(null, {
        status: 500
    });
    
    try{
        response = await fetch(`${baseURL}player/changePassword`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                password,
                confirmPassword
            })
        });
    }catch(error){
        console.log(error);
    }finally{
        return response;
    }
}