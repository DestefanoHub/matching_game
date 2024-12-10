import { createSelector, createSlice } from '@reduxjs/toolkit';

import { addGame } from './appSlice';

const values = [
    'orange',
    'orange',
    'red',
    'red',
    'blue',
    'blue',
    'green',
    'green',
    'yellow',
    'yellow',
    'purple',
    'purple',
    'brown',
    'brown',
    'black',
    'black',
    'white',
    'white',
    'cyan',
    'cyan',
    'magenta',
    'magenta',
    'gold',
    'gold'
];

const initialState = {
    tiles: [],
    points: 0,
    totalPoints: 0,
    time: 60,
    gameOver: false,
    hasWon: false,
    init: false,
    player: null,
    difficulty: 1
};

const getActiveTiles = (tiles) => {
    const indices = [];

    tiles.forEach((tile, index) => {        
        if(tile.isActive){
            indices.push(index);
        }
    });

    return indices;
};

const getDisplayDifficulty = (diff) => {
    switch(diff){
        case 2: return 'normal';
        case 3: return 'hard';
        case 1:
        default: return 'easy';
    }
};

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        init: () => {
            return initialState;
        },
        setup: (state, action) => {
            const tileGrid = [];
            let gridSize = 12;

            switch(action.payload.difficulty){
                case 2:
                    gridSize = 18;
                    break;
                case 3:
                    gridSize = 24;
                    break;
                case 1:
                default:
                    gridSize = 12;
                    break;
            }

            const difficultyValues = values.slice(0, gridSize);

            for(let i = 0; i < gridSize; i++){
                const minCeiled = Math.ceil(0);
                const maxFloored = Math.floor(difficultyValues.length - 1);
                const valueIndex = Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
                
                tileGrid.push({
                    id: i,
                    value: difficultyValues[valueIndex],
                    isActive: false,
                    isScored: false
                });
            
                difficultyValues.splice(valueIndex, 1);
            }

            state.init = true;
            state.player = action.payload.player;
            state.difficulty = action.payload.difficulty;
            state.tiles = tileGrid;
            state.totalPoints = (tileGrid.length / 2);
        },
        reveal: (state, action) => {
            const tileIndex = state.tiles.findIndex((tile) => {
                return tile.id === action.payload;
            });

            const activeTiles = getActiveTiles(state.tiles);

            if(activeTiles.length < 2 && tileIndex !== -1){
                const isTileActive = activeTiles.some((tileIndex) => {
                    return state.tiles[tileIndex].value === action.payload;
                });

                if(!isTileActive){
                    state.tiles[tileIndex].isActive = true;
                }
            }
        },
        decrement: (state) => {
            if(state.time > 0){
                state.time--;
            }
        },
        score: (state) => {
            const newScore = state.points + 1;
            const activeTiles = getActiveTiles(state.tiles);

            if(activeTiles.length === 2){
                if(state.tiles[activeTiles[0]].value === state.tiles[activeTiles[1]].value){
                    state.tiles[activeTiles[0]].isScored = true;
                    state.tiles[activeTiles[1]].isScored = true;

                    if(!state.gameOver){
                        state.points = newScore;

                        if(newScore === state.totalPoints){
                            state.hasWon = true;
                            state.gameOver = true;
                        }
                    }
                }

                state.tiles[activeTiles[0]].isActive = false;
                state.tiles[activeTiles[1]].isActive = false;
            }
        },
        lose: (state) => {
            state.gameOver = true;
            state.hasWon = false;
        }
    }
});

export const scoreThunk = () => (dispatch, getState) => {
    dispatch(score());
    
    const gameState = getState().game;

    if(gameState.gameOver){
        dispatch(addGame({
            player: gameState.player,
            difficulty: gameState.difficulty,
            hasWon: gameState.hasWon,
            score: gameState.score,
            totalScore: gameState.totalScore,
            time: gameState.time,
            date: new Date().toJSON()
        }));
    }
};

export const decrementThunk = () => (dispatch, getState) => {
    dispatch(decrement());

    const gameState = getState().game;

    //Check if the game time has expired.
    if(!gameState.time){
        dispatch(lose());
        /*
        * It isn't necessary to get waste time calling 'getState' again here.
        * The only two values being recorded that would not be updated in the current state are
        * 'hasWon' and 'time', and we know what both of those should be at this point.
        */
        dispatch(addGame({
            player: gameState.player,
            difficulty: gameState.difficulty,
            hasWon: false,
            score: gameState.score,
            totalScore: gameState.totalScore,
            time: 0,
            date: new Date().toJSON()
        }));
    }
};

export const { init, setup, reveal, decrement, score, lose } = gameSlice.actions;
export const selectInit = (state) => state.game.init;
export const selectPlayer = (state) => state.game.player;
const selectDifficulty = (state) => state.game.difficulty;
export const selectDisplayDifficulty = createSelector([selectDifficulty], (diff) => {return getDisplayDifficulty(diff)});
export const selectTiles = (state) => state.game.tiles;
export const selectActiveTiles = createSelector([selectTiles], (tiles) => {return getActiveTiles(tiles)});
export const selectHasWon = (state) => state.game.hasWon;
export const selectGameOver = (state) => state.game.gameOver;
export const selectTime = (state) => state.game.time;
// export const selectPoints = (state) => state.game.points;
// export const selectTotalPoints = (state) => state.game.totalPoints;
export default gameSlice.reducer;