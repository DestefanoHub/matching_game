const baseURL = 'http://localhost:3100/';

export const getGameInfo = async (gameId) => {
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

export const getRecentGames = async () => {
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

export const getGames = async (player, winLoss, diff, sortBy, page) => {
    const queryParams = new URLSearchParams();
    const gamesData = {
        gamesArray: [],
        totalGames: 0
    };

    queryParams.append('player', player);
    queryParams.append('winLoss', winLoss);
    queryParams.append('diff',diff);
    queryParams.append('sortBy', sortBy);
    queryParams.append('page', page);
    
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
    gamesData.gamesArray = history.games;
    gamesData.totalGames = history.totalGames;

    return gamesData;
};

export const saveGame = async (player, difficulty, hasWon, points, totalPoints, time) => {
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