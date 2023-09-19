import { Directions, GameState, SnakeObject, SnakeVals } from './SnakeValues';

export function initializeGridValues (height:number, width:number){
    const initArr:number[] = new Array(height*width).fill(SnakeVals.NotVisible);
    return initArr;
}

export function updateGridValues_Start(snakeObj:SnakeObject, height:number, width:number):SnakeObject {
    const snakeStart:number = Math.floor(Math.random()*width*height);
    const fruitStart:number = Math.floor(Math.random()*width*height);
    if  (snakeStart === fruitStart) {
        return updateGridValues_Start(snakeObj, height, width);
    }
    snakeObj.gameStateVisual[snakeStart] = SnakeVals.SnakeVisible;
    snakeObj.gameStateVisual[fruitStart] = SnakeVals.FruitVisible;
    snakeObj.snakePath = [snakeStart];
    return snakeObj;
}

export function updateGridValues(snakeObj:SnakeObject, height:number, width:number, direction:number): SnakeObject  {
    const fruitLocation:number = snakeObj.gameStateVisual.findIndex(x => x === SnakeVals.FruitVisible) || -1;
    if (snakeObj.snakePath !== null && snakeObj.snakePath !== undefined) {
        const nextSnakeCell:number = getNextSnakeLocation(snakeObj.snakePath[0], width, direction);
        //snake will not encounter any object
        if (nextSnakeCell !== fruitLocation && nextSnakeCell >= 0) {
            snakeObj.gameStateVisual = initializeGridValues(height, width);
            snakeObj.snakePath = [nextSnakeCell].concat(snakeObj.snakePath.slice(0,snakeObj.snakePath.length-1));
            for(let i = 0; i < snakeObj.snakePath.length; i++) {
                snakeObj.gameStateVisual[snakeObj.snakePath[i]] = SnakeVals.SnakeVisible;
            }
            snakeObj.gameStateVisual[fruitLocation] = SnakeVals.FruitVisible;
        //snake will encounter fruit
        } else if (nextSnakeCell === fruitLocation) {
            snakeObj.gameStateVisual[fruitLocation] = SnakeVals.SnakeVisible;
            snakeObj.snakePath = [fruitLocation].concat(snakeObj.snakePath.slice());

            const newFruitLocation:number = updateFruitLocation(snakeObj, height, width);
            if (newFruitLocation !== GameState.Win) {
                snakeObj.gameStateVisual[newFruitLocation] = SnakeVals.FruitVisible;
            } else {
                //PUT IN WIN LOGIC
            }
        //snake will encounter wall
        } else {
            //PUT IN LOSE LOGIC
        }
    }
    return snakeObj;
}

function getNextSnakeLocation(snakePathStart:number, width:number, direction:number): number {
    switch (direction) {
        case Directions.Up:
            return snakePathStart-width;
        case Directions.Down:
            return snakePathStart+width;
        case Directions.Left:
            return snakePathStart-1;
        case Directions.Right:
            return snakePathStart+1;
        default:
            return -1;
    }
}

function updateFruitLocation(snakeObj:SnakeObject, height:number, width:number): number {
    //all squares are the snake
    if (snakeObj.snakePath.length === height*width) {
        return GameState.Win;
    }
    const tempValsAvail:number[] = snakeObj.gameStateVisual.filter(x => x === SnakeVals.NotVisible);
    return Math.floor(Math.random()*tempValsAvail.length);
}