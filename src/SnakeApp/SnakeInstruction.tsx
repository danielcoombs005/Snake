import React from 'react';
import './SnakeInstruction.css';

function SnakeInstruction(props:any) {
    return (
        <div onClick={() => props.closeInstructionWindow()}className='snake_instruction'>
            <h3>HOW TO PLAY</h3>
            <p>Press the up arrow key or W to move up.</p>
            <p>Press the down arrow key or S to move down.</p>
            <p>Press the left arrow key or A to move to the left.</p>
            <p>Press the right arrow key or D to move to the right.</p>
            <p>Click anywhere in the window to close.</p>
        </div>
    );
}

export default SnakeInstruction;