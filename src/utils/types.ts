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
    player: Player
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
        error: AccountMessageTypes | null
    },
    passwordObj: {
        value: string,
        error: AccountMessageTypes | null
    },
    confirmObj: {
        value: string,
        error: AccountMessageTypes | null
    },
    mainError: AccountMessageTypes | null,
    canSubmit: boolean
};

export const AccountMessages = {
    INVALID: 'Invalid crednetials',
    UNAMELENGTH: 'Username must be between 5 and 30 characters',
    UNAMETAKEN: 'Cannot create an account with this username',
    PWORDLENGTH: 'Password must be between 12 and 30 characters',
    PWORDNOMATCH: 'Passwords do not match',
    SERVERERROR: 'The server has encountered an error and was unable to process your request'
} as const;

export type AccountMessageTypes = typeof AccountMessages[keyof typeof AccountMessages];

export type Player = {
    ID: string,
    username: string,
    JWT?: string
};