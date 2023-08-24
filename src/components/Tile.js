import React from 'react'
import ReactDOM from 'react-dom'
import { useState } from 'react'
import PropTypes from 'prop-types'
import './Tile.css'

function Tile({ letter, length, className, onDragStart, onDragging, onDragEnd, onMouseIn, onMouseOut }) {
    const outerPadding = Math.floor(0.05*length)
    const innerPadding = Math.floor(0.1*length);
    const outerLength = length - outerPadding * 2;
    const innerLength = outerLength - innerPadding * 2;

    const outerStyle = {
        width: length,
        height: length,
        padding: outerPadding,
        boxSizing: "border-box",
    };

    const tileStyle = {
        width: outerLength,
        height: outerLength,
        padding: innerPadding,
        boxSizing: "border-box"
    };

    const innerStyle = {
        display: "flex",
        width: innerLength,
        height: innerLength,
        boxSizing: "border-box",
        justifyContent: "center",
        alignItems: "center",
        fontSize: `${Math.floor(0.75*innerLength)}px`
    };


    return (
    <div className={className} style={outerStyle} onMouseDown={onDragStart} onMouseUp={onDragEnd}>
        <div style={tileStyle} onMouseOver={onMouseIn} onMouseLeave={onMouseOut}> 
            <div style={innerStyle} onMouseEnter={onDragging}>
                {letter}
            </div>
        </div>
    </div>);
    
}

Tile.propTypes = {
    letter: PropTypes.string.isRequired,
    length: PropTypes.number.isRequired,
    className: PropTypes.string.isRequired,
    onDragStart: PropTypes.func,
    onDragging: PropTypes.func,
    onDragEnd: PropTypes.func,
    onMouseIn: PropTypes.func,
    onMouseOut: PropTypes.func
}

export default Tile