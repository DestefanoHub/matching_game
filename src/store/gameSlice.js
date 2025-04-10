import { createSelector, createSlice } from '@reduxjs/toolkit';

import { saveGame } from '../utils/gateway';

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
    difficulty: 1,
    savedGame: {}
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

export const getDisplayDifficulty = (diff) => {
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
                const valueIndex = Math.floor(Math.random() * (difficultyValues.length));
                
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
        },
        setSavedGame: (state, action) => {
            state.savedGame = action.payload;
        }
    }
});

export const scoreThunk = () => async (dispatch, getState) => {
    dispatch(score());
    
    const gameState = getState().game;

    if(gameState.gameOver){
        const savedGame = await saveGame(gameState.player, gameState.difficulty, gameState.hasWon, gameState.points, gameState.totalPoints, gameState.time);
        dispatch(setSavedGame(savedGame));
    }
};

export const decrementThunk = () => async (dispatch, getState) => {
    dispatch(decrement());

    const gameState = getState().game;

    //Check if the game time has expired.
    if(!gameState.time){
        dispatch(lose());
        const savedGame = await saveGame(gameState.player, gameState.difficulty, false, gameState.points, gameState.totalPoints, 0)
        dispatch(setSavedGame(savedGame));
    }
};

export const { init, setup, reveal, decrement, score, lose, setSavedGame } = gameSlice.actions;
export const selectInit = (state) => state.game.init;
export const selectPlayer = (state) => state.game.player;
const selectDifficulty = (state) => state.game.difficulty;
export const selectDisplayDifficulty = createSelector([selectDifficulty], (diff) => getDisplayDifficulty(diff));
export const selectTiles = (state) => state.game.tiles;
export const selectActiveTiles = createSelector([selectTiles], (tiles) => getActiveTiles(tiles));
export const selectHasWon = (state) => state.game.hasWon;
export const selectGameOver = (state) => state.game.gameOver;
export const selectTime = (state) => state.game.time;
export const selectSavedGame = (state) => state.game.savedGame;
export default gameSlice.reducer;