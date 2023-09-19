import React from 'react';
import SnakeGrid from './SnakeGrid';
import SnakeInstruction from './SnakeInstruction';
import { Directions, KeyCodes, SnakeObject, SnakeUpdateObject, SnakeVals } from './SnakeValues';
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
            this.updateGameState(this.updateGame(direction));
        }
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
                tempSnakeObj = Logic.updateGridValues(tempSnakeObj, this.state.height, this.state.width, action);
                break;
            default:
                break;
        }
        return new SnakeUpdateObject(action, tempSnakeObj);
    }

    updateGameState = (snakeUpdateObject:SnakeUpdateObject) => {
        this.setState({ 
            previousDirection: snakeUpdateObject.previousDirection,
            snakeObject: snakeUpdateObject.snakeObject 
        });
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