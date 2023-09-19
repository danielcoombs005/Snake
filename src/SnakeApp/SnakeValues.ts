//constants
export const SnakeColors = {
    BGColor: 'transparent',
    SnakeColor: '#474446',
    FruitColor: 'red'
}

export const GameState = {
    Win: -1,
    Paused: 0,
    InProgress: 1,
    Lose: 2,
    NotActive: 3
}

export const GameStateArrays = {
    Win: [],
    Lose: [-1]
}

export const KeyCodes = {
    A: 65,
    D: 68,
    S: 83,
    W: 87,
    DOWN_ARROW: 40,
    LEFT_ARROW: 37,
    RIGHT_ARROW: 39,
    UP_ARROW: 38
}

//enumerators
export enum SnakeVals {
    NotVisible,
    SnakeVisible,
    FruitVisible
}

export enum Directions {
    Up=15,
    Down,
    Left,
    Right,
    Start,
    End
}

//models
 export class SnakeObject {
     gameStateVisual: number[] = [];
     snakePath: number[] = [];

     constructor(gameStateVisual: number[], snakePath: number[]) {
        this.gameStateVisual = gameStateVisual;
        this.snakePath = snakePath;
     }
 }

 export class SnakeUpdateObject {
    previousDirection: number;
    snakeObject: SnakeObject;

    constructor(previousDirection: number, snakeObject: SnakeObject) {
        this.previousDirection = previousDirection;
        this.snakeObject = snakeObject;
    }
 }