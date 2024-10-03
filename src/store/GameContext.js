import { createContext, useContext, useReducer } from 'react';

const tileGrid = [];
const values = ['orange', 'orange', 'red', 'red', 'blue', 'blue', 'green', 'green', 'yellow', 'yellow', 'purple', 'purple'];
    
for(let i = 0; i < 12; i++){
    const minCeiled = Math.ceil(0);
    const maxFloored = Math.floor(values.length - 1);
    const valueIndex = Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
    
    tileGrid.push({
        id: i,
        value: values[valueIndex],
    });

    values.splice(valueIndex, 1);
}

const initialState = {
    tiles: tileGrid,
    activeTiles: [],
    points: 0,
    totalPoints: values.length / 2,
    gameOver: false,
    hasWon: false
};

const GameContext = createContext(initialState);
const GameDispatchContext = createContext(null);

const gameReducer = (state, action) => {
    switch(action.type){
        case 'reveal': {
            const tileIndex = state.tiles.findIndex((tile) => {
                return tile.id === action.id;
            });

            if(state.activeTiles.length < 2 && tileIndex !== -1){
                const isTileActive = state.activeTiles.some((tile) => {
                    return tile.id === action.id;
                });

                if(!isTileActive){
                    const currentTile = state.tiles[tileIndex];

                    return {
                        ...state,
                        activeTiles: [...state.activeTiles, currentTile]
                    };
                }
            }

            return state;
        }
        case 'clear': {
            return {
                ...state,
                activeTiles: []
            };
        }
        case 'score': {
            const newScore = state.points++;

            if(newScore === state.totalPoints){
                return {
                    ...state,
                    points: newScore,
                    activeTiles: [],
                    hasWon: true,
                    gameOver: true
                };
            }
            
            return {
                ...state,
                points: newScore,
                activeTiles: []
            };
        }
        default: return state;
    }
};

export function useGame(){
    return useContext(GameContext);
};

export function useGameDispatch(){
    return useContext(GameDispatchContext);
};

export function GameProvider({children}){
    const [gameState, dispatch] = useReducer(gameReducer, initialState);

    return <GameContext.Provider value={gameState}>
        <GameDispatchContext.Provider value={dispatch}>
            {children}
        </GameDispatchContext.Provider>
    </GameContext.Provider>;
};