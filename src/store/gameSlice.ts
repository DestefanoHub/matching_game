import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { saveGame } from '../utils/gateway';
import type { Difficulty, DifficultyText, Tile } from '../utils/types';
import type { AppThunk, RootState } from './store';

type State = {
    tiles: Tile[],
    points: number,
    totalPoints: number,
    time: number,
    gameOver: boolean,
    hasWon: boolean,
    init: boolean,
    player: string|null,
    difficulty: Difficulty,
    // savedGame: any
};

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

const initialState: State = {
    tiles: [],
    points: 0,
    totalPoints: 0,
    time: 60,
    gameOver: false,
    hasWon: false,
    init: false,
    player: null,
    difficulty: 1,
    // savedGame: {}
};

const getActiveTiles = (tiles: Tile[]): number[] => {
    const indices: number[] = [];

    tiles.forEach((tile, index) => {        
        if(tile.isActive){
            indices.push(index);
        }
    });

    return indices;
};

export const getDisplayDifficulty = (diff: Difficulty): DifficultyText => {
    switch(diff){
        case 2: return 'Normal';
        case 3: return 'Hard';
        case 1:
        default: return 'Easy';
    }
};

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        init: () => {
            return initialState;
        },
        setup: (state, action: PayloadAction<{player: string, difficulty: Difficulty}>) => {
            const tileGrid: Tile[] = [];
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
        reveal: (state, action: PayloadAction<number>) => {
            const tileIndex = state.tiles.findIndex((tile) => {
                return tile.id === action.payload;
            });

            const activeTiles = getActiveTiles(state.tiles);

            if(activeTiles.length < 2 && tileIndex !== -1){
                const isTileActive = activeTiles.some((tileIndex) => {
                    return state.tiles[tileIndex].id === action.payload;
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
        // setSavedGame: (state, action: PayloadAction<Game>) => {
        //     state.savedGame = action.payload;
        // }
    }
});

export const scoreThunk = (): AppThunk<void> => async (dispatch, getState) => {
    dispatch(score());
    
    const gameState = getState().game;

    if(gameState.gameOver){
        await saveGame(gameState.player!, gameState.difficulty, gameState.hasWon, gameState.points, gameState.totalPoints, gameState.time);
        // dispatch(setSavedGame(savedGame));
    }
};

export const decrementThunk = (): AppThunk<void> => async (dispatch, getState) => {
    dispatch(decrement());

    const gameState = getState().game;

    //Check if the game time has expired.
    if(!gameState.time){
        dispatch(lose());
        await saveGame(gameState.player!, gameState.difficulty, false, gameState.points, gameState.totalPoints, 0)
        // dispatch(setSavedGame(savedGame));
    }
};

export const { init, setup, reveal, decrement, score, lose } = gameSlice.actions;
export const selectInit = (state: RootState) => state.game.init;
export const selectPlayer = (state: RootState) => state.game.player;
const selectDifficulty = (state: RootState) => state.game.difficulty;
export const selectDisplayDifficulty = createSelector([selectDifficulty], (diff) => getDisplayDifficulty(diff));
export const selectTiles = (state: RootState) => state.game.tiles;
export const selectActiveTiles = createSelector([selectTiles], (tiles) => getActiveTiles(tiles));
export const selectHasWon = (state: RootState) => state.game.hasWon;
export const selectGameOver = (state: RootState) => state.game.gameOver;
export const selectTime = (state: RootState) => state.game.time;
// export const selectSavedGame = (state: RootState) => state.game.savedGame;
export default gameSlice.reducer;