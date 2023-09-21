import React from 'react';
import SnakeGrid from './SnakeGrid';
import SnakeInstruction from './SnakeInstruction';
import { Directions, GameState, GameStateArrays, KeyCodes, SnakeObject, SnakeUpdateObject, SnakeVals } from './SnakeValues';
import * as Logic from './SnakeMainLogic';

class SnakeMain extends React.Component<any,any> {
    constructor(props:any) {
        super(props);
        this.state = {
            //arrays
            //booleans
            isGameActive: false,
            isInstructionVisible: false,
            //objects
            snakeObject: new SnakeObject([],[]),
            //numbers
            delayInMS: 500,
            gameState: GameState.NotActive,
            height: 10,
            width: 10,
            previousDirection: -1
        };
    }

    //#region General logic
    componentDidMount = () => {
        const gridValues:number[] = Logic.initializeGridValues(this.state.height, this.state.width);
        this.setState({ snakeObject: new SnakeObject(gridValues, []) });
    }
    //#endregion

    //#region Game logic
    playGame = () => {
        while (this.state.gameState === GameState.InProgress) {
            Logic.Delay(this.state.delayInMS);
            if (this.state.previousDirection !== -1) {
                this.handleKeyPress(this.state.previousDirection);
            }
        }
    }

    handleKeyPress = (e:any) => {
        if (this.state.isGameActive) {
            let direction:number = -1;
            switch (e.keyCode) {
                case KeyCodes.W:
                case KeyCodes.UP_ARROW:
                    direction = Directions.Up;
                    break;
                case KeyCodes.A:
                case KeyCodes.LEFT_ARROW:
                    direction = Directions.Left;
                    break;
                case KeyCodes.S:
                case KeyCodes.DOWN_ARROW:
                    direction = Directions.Down;
                    break;
                case KeyCodes.D:
                case KeyCodes.RIGHT_ARROW:
                    direction = Directions.Right;
                    break;
                default:
                    break;
            }
            if (!Logic.isDirectionOpposite(this.state.previousDirection, direction)) {
                this.updateGameState(this.updateGame(direction));
            }
        }
    }

    handleWin = () => {
        alert('You win! Click the button to start a new game!');
        this.updateGameState(this.updateGame(Directions.Start));
    }

    handleLoss = () => {
        alert('You lose. Click the button to start a new game.');
        this.updateGameState(this.updateGame(Directions.Start));
    }

    updateGame = (action:number):SnakeUpdateObject => {
        let tempSnakeObj:SnakeObject = {...this.state.snakeObject};

        switch(action) {
            case Directions.Start:
                tempSnakeObj.gameStateVisual = Logic.initializeGridValues(this.state.height, this.state.width);
                tempSnakeObj = Logic.updateGridValues_Start(tempSnakeObj, this.state.height, this.state.width);
                this.setState({
                    isGameActive: true
                });
                break;
            case Directions.End:
                this.setState({
                    isGameActive: false
                });
                break;
            case Directions.Up:
            case Directions.Down:
            case Directions.Left:
            case Directions.Right:
                if (this.state.gameState !== GameState.InProgress) {
                    this.setState({ 
                        gameState: GameState.InProgress
                    }, () => this.playGame());
                }
                tempSnakeObj = Logic.updateGridValues(tempSnakeObj, this.state.height, this.state.width, action);
                break;
            default:
                break;
        }
        return new SnakeUpdateObject(action, tempSnakeObj);
    }

    updateGameState = (snakeUpdateObject:SnakeUpdateObject) => {
        // user wins
        if (snakeUpdateObject.snakeObject.snakePath === GameStateArrays.Win) {
            this.setState({
                gameState: GameState.Win,
                isGameActive: false,
                snakeObject: snakeUpdateObject.snakeObject
            }, () => this.handleWin());
        // user loses
        } else if(snakeUpdateObject.snakeObject.snakePath === GameStateArrays.Lose) {
            this.setState({
                gameState: GameState.Lose,
                isGameActive: false,
                snakeObject: snakeUpdateObject.snakeObject
            }, () => this.handleLoss());
        //game is still in progress
        } else {
            if (!this.state.isgameActive) {
                this.setState({
                    gameState: GameState.InProgress,
                    isGameActive: true
                });
            }
            this.setState({
                previousDirection: snakeUpdateObject.previousDirection,
                snakeObject: snakeUpdateObject.snakeObject
            });
        }
    }
    //#endregion

    render() {
        return (
            <div onKeyDown={this.handleKeyPress} tabIndex={0}>
                {this.state.isInstructionVisible && 
                <SnakeInstruction 
                    closeInstructionWindow={() => this.setState({ isInstructionVisible: false })}
                />}
                <SnakeGrid 
                    gameStateVisual={this.state.snakeObject.gameStateVisual}
                    height={this.state.height}
                    width={this.state.width}
                />
                <button onClick={() => this.updateGameState(this.updateGame(Directions.Start))}>Test Start</button>
                <button onClick={() => {this.setState({ isInstructionVisible: true })}}>Instructions</button>
            </div>
        )
    }
}

export default SnakeMain;