export type SortBy = 'sa'|'sd'|'da'|'dd';

export type WinLoss = 'w'|'l'|'a';

export type Difficulty = 0|1|2|3;

export type DifficultyText = 'Easy'|'Normal'|'Hard';

export function isSortByType(value: unknown): value is SortBy {
    return ['sa', 'sd', 'da', 'dd'].includes(value as string);
}

export function isWinLossType(value: unknown): value is WinLoss {
    return ['w', 'l', 'a'].includes(value as string);
}

export function isDifficultyType(value: unknown): value is Difficulty {
    return [0, 1, 2, 3].includes(value as number);
}

export type Tile = {
    id: number,
    value: string,
    isActive: boolean,
    isScored: boolean
};

export type Game = {
    _id: string,
    date: Date,
    player: {
        pid: string,
        username: string
    },
    difficulty: number,
    hasWon: boolean,
    points: number,
    totalPoints: number,
    time: number
};

export type PlayerStats = {
    isFirstGame: boolean,
    isFirstWin: boolean,
    isFirstDiffGame: boolean,
    isFirstDiffWin: boolean,
    isFastestDiffTime: boolean
};

export type GameData = {
    game: Game | Record<PropertyKey, never>,
    stats: PlayerStats
};

export type MultiGamesData = {
    games: Game[],
    totalGames: number
};

export type AccountResponse = {
    usernameObj?: {
        value: string,
        error: boolean,
        message: string
    },
    passwordObj: {
        value: string,
        error: boolean,
        message: string
    },
    confirmObj: {
        value: string,
        error: boolean,
        message: string
    },
    mainError: boolean
};

export type LoginResponse = {
    usernameObj: {
        value: string,
        error: boolean,
        message: string
    },
    passwordObj: {
        value: string,
        error: boolean,
        message: string
    },
    mainError: boolean
};

export type Player = {
    ID: string,
    username: string,
    JWT?: string
};