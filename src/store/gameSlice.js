import { createSelector, createSlice } from '@reduxjs/toolkit';

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

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
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
            return state;
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
                    return state;
                }
            }

            return state;
        },
        clear: (state) => {
            const activeTiles = getActiveTiles(state.tiles);

            if(activeTiles.length === 2){
                state.tiles[activeTiles[0]].isActive = false;
                state.tiles[activeTiles[1]].isActive = false;
            }

            return state;
        },
        score: (state) => {
            const newScore = state.points + 1;
            const activeTiles = getActiveTiles(state.tiles);

            if(activeTiles.length === 2){
                state.tiles[activeTiles[0]].isActive = false;
                state.tiles[activeTiles[0]].isScored = true;
                state.tiles[activeTiles[1]].isActive = false;
                state.tiles[activeTiles[1]].isScored = true;

                if(!state.gameOver){
                    if(newScore === state.totalPoints){
                        state.points = newScore;
                        state.hasWon = true;
                        state.gameOver = true;
                        return state;
                    }
                    
                    state.points = newScore;
                    return state;
                }
            }

            return state;
        }
    }
});

export const { setup, reveal, clear, score } = gameSlice.actions;
export const selectInit = (state) => state.game.init;
export const selectPlayer = (state) => state.game.player;
export const selectDifficulty = (state) => state.game.difficulty;
export const selectTiles = (state) => state.game.tiles;
export const selectActiveTiles = createSelector([selectTiles], (tiles) => {return getActiveTiles(tiles)});
export const selectHasWon = (state) => state.game.hasWon;
export default gameSlice.reducer;