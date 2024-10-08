import { createSlice } from '@reduxjs/toolkit'

const tileGrid = [];
const values = ['orange', 'orange', 'red', 'red', 'blue', 'blue', 'green', 'green', 'yellow', 'yellow', 'purple', 'purple'];
    
for(let i = 0; i < 12; i++){
    const minCeiled = Math.ceil(0);
    const maxFloored = Math.floor(values.length - 1);
    const valueIndex = Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
    
    tileGrid.push({
        id: i,
        value: values[valueIndex]
    });

    values.splice(valueIndex, 1);
}

const initialState = {
    tiles: tileGrid,
    activeTiles: [],
    points: 0,
    totalPoints: (tileGrid.length / 2),
    gameOver: false,
    hasWon: false
};

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        reveal: (state, action) => {
            const tileIndex = state.tiles.findIndex((tile) => {
                return tile.id === action.payload;
            });

            if(state.activeTiles.length < 2 && tileIndex !== -1){
                const isTileActive = state.activeTiles.some((tile) => {
                    return tile.id === action.payload;
                });

                if(!isTileActive){
                    state.activeTiles.push(state.tiles[tileIndex]);
                    return state;
                }
            }

            return state;
        },
        clear: (state) => {
            state.activeTiles = [];
            return state;
        },
        score: (state) => {
            const newScore = state.points + 1;

            if(!state.gameOver){
                if(newScore === state.totalPoints){
                    state.points = newScore;
                    state.activeTiles = [];
                    state.hasWon = true;
                    state.gameOver = true;
                    return state;
                }
                
                state.points = newScore;
                state.activeTiles = [];
                return state;
            }

            return state;
        }
    }
});

export const { reveal, clear, score } = gameSlice.actions;
export const selectTiles = (state) => state.game.tiles;
export const selectActiveTiles = (state) => state.game.activeTiles;
export const selectHasWon = (state) => state.game.hasWon;
export default gameSlice.reducer;