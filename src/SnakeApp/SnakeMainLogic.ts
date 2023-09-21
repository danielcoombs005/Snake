import { Directions, GameState, GameStateArrays, SnakeObject, SnakeVals } from './SnakeValues';

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
    let fruitLocation:number = snakeObj.gameStateVisual.findIndex(x => x === SnakeVals.FruitVisible) || -1;
    //fixes issue where fruit disappears when index is 0 (recognizes location on console with same logic then is not able to locate it in the actual command)
    if (snakeObj.gameStateVisual[0] === SnakeVals.FruitVisible) {
        fruitLocation = 0;
    }
    if (snakeObj.snakePath !== null && snakeObj.snakePath !== undefined) {
        const nextSnakeCell:number = getNextSnakeLocation(snakeObj.snakePath[0], width, direction);
        //snake will encounter wall or itself
        if (willCollisionOccur(snakeObj, height, width, direction)) {
            snakeObj.snakePath = GameStateArrays.Lose;
        //snake will not encounter wall or itself
        } else if (nextSnakeCell !== fruitLocation && nextSnakeCell >= 0) {
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
                snakeObj.snakePath = GameStateArrays.Win;
            }
        } else {
            snakeObj.snakePath = GameStateArrays.Lose;
        }
    }
    return snakeObj;
}

export function isDirectionOpposite (previousDirection:number, currentDirection:number):boolean {
    if ((previousDirection === Directions.Left && currentDirection === Directions.Right) ||
         (previousDirection === Directions.Up && currentDirection === Directions.Down) ||
         (previousDirection === Directions.Right && currentDirection === Directions.Left) ||
         (previousDirection === Directions.Down && currentDirection === Directions.Up)) {
            return true;
    }
    return false;
}

export async function Delay(amount:number): Promise<{}> {
    return new Promise((res:any) => {
        setTimeout(res, amount);
    });
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
    let tempValsAvail:number[] = [];
    for (let i = 0; i < snakeObj.gameStateVisual.length; i++) {
        if (snakeObj.gameStateVisual[i] === SnakeVals.NotVisible) {
            tempValsAvail.push(i);
        }
    }   
    return tempValsAvail[Math.floor(Math.random()*tempValsAvail.length)];
}

function willCollisionOccur(snakeObj:SnakeObject, height:number, width:number, currentDirection:number):boolean {
    let nextSpace:number = currentDirection === Directions.Left ? snakeObj.snakePath[0] - 1 :
                             currentDirection === Directions.Right ? snakeObj.snakePath[0] + 1 : 
                             (currentDirection === Directions.Up && snakeObj.snakePath[0] - width >= 0) ? snakeObj.snakePath[0] - width :
                             (currentDirection === Directions.Down && snakeObj.snakePath[0] + width < height*width) ? snakeObj.snakePath[0] + width :
                             -1;
    if ((currentDirection === Directions.Left && nextSpace % width === width - 1) ||
        currentDirection === Directions.Right && nextSpace % width === 0 ||
        snakeObj.snakePath.includes(nextSpace)) {
        nextSpace = -1;
    }
    return nextSpace === -1;
}