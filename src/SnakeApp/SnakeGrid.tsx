import React, { useState, useEffect } from 'react';
import { SnakeVals, SnakeColors} from './SnakeValues';
import './SnakeGrid.css';

function fillGrid() {

}

function SnakeGrid(props:any) {
    return (
        <div>
            {Array(props.height).fill(0).map((x:any, index_x:number) =>
                <div className='snake_grid_row' key={`snake_grid_row_${index_x}`}>
                    {props.gameStateVisual.slice(props.height*index_x,props.height*index_x+props.width).map((y:number, index_y:number) =>
                        <span className='snake_grid_cell' 
                            style={{ backgroundColor: 
                                y === SnakeVals.SnakeVisible ? SnakeColors.SnakeColor : 
                                y === SnakeVals.FruitVisible ? SnakeColors.FruitColor :
                                                               SnakeColors.BGColor }} 
                            key={`snake_grid_cell_${index_y}`}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default SnakeGrid;