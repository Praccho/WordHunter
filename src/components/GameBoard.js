import React from "react";
import { ReactDOM } from "react";
import { useState, useEffect } from "react";
import Tile from "./Tile";
import { Repeat, update } from "immutable";
import './GameBoard.css'

function GameBoard() {
    const windowW = window.innerWidth;
    const windowH = window.innerHeight;

    const numTiles = 8;
    const minLen = Math.min(windowH, windowW);
    const tileW = Math.floor(minLen / numTiles);
    
    const [tileLetters, setTileLetters] = useState(Array(8).fill(null).map(() => Array(8).fill('')));
    const [selectedTile, setSelectedTile] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [dragTiles, setDragTiles] = useState([]);
    const [seenTiles, setSeenTiles] = useState(Array(8).fill(null).map(() => Array(8).fill(0)));
    const [dragging, setDragging] = useState(false);

    const handleMouseDown = (rowIndex, colIndex) => {
        if (tileLetters[rowIndex][colIndex] != '') {
            setDragging(true);
        }
    }

    function validNext(row, col, prevR, prevC) {
        return Math.abs(row - prevR) <= 1 && Math.abs(col - prevC) <= 1
    }

    const handleMouseDrag = (rowIndex, colIndex) => {
        if (dragging && !seenTiles[rowIndex][colIndex] && tileLetters[rowIndex][colIndex] != '' &&
            (seenTiles.length == 0 || validNext(rowIndex, colIndex, seenTiles[seenTiles.length-1].row, seenTiles[seenTiles.length-1].col))) {
            
            const seenTilesCopy = [...seenTiles];
            seenTilesCopy[rowIndex][colIndex] = 1;

            const dragTilesCopy = [...dragTiles];
            const appTile = {letter: tileLetters[rowIndex][colIndex], row: rowIndex, col: colIndex};
            dragTilesCopy.push(appTile)
            
            setSeenTiles(seenTilesCopy);
            setDragTiles(dragTilesCopy);
        }
    }

    const handleMouseUp = (rowIndex, colIndex) => {
        // drag ends on same key (aka select)
        if (dragging) {
            //validate word
            setSeenTiles(Array(8).fill(null).map(() => Array(8).fill(0)));
            setDragging(false);
            setDragTiles([]);
        }
        if (dragTiles.length <= 1 && (!selectedTile || !(selectedTile && selectedTile.rowIndex === rowIndex && selectedTile.colIndex === colIndex))) {
            setSelectedTile({rowIndex, colIndex});
            setInputValue(''); 
        } else {
            setSelectedTile(null)
        }
    }

    const handleKeyUp = (e) => {
        if (selectedTile) {
            const updatedTileLetters = [...tileLetters]
            if (/^[a-zA-A]$/.test(e.key)) {
                updatedTileLetters[selectedTile.rowIndex][selectedTile.colIndex] = e.key.toUpperCase();
            } else if (e.key === "Backspace") {
                updatedTileLetters[selectedTile.rowIndex][selectedTile.colIndex] = '';
            }
            setTileLetters(updatedTileLetters);
            setSelectedTile(null);
            setInputValue('');
        }
    }

    useEffect(() => {
        window.addEventListener('keyup', handleKeyUp);
    
        return () => {
            window.removeEventListener('keyup', handleKeyUp);
        };
    });

    const handleDragEnter = (rowIndex, colIndex) => {

    }

    return (
        <div className="game-board">
            {tileLetters.map((row, rowIndex) => (
                <div key={rowIndex} className="row">
                    {row.map((content, colIndex) => (
                        <Tile
                        key={colIndex}
                        letter={content}
                        length={tileW}
                        className={`tile 
                            ${selectedTile &&
                            selectedTile.rowIndex === rowIndex && selectedTile.colIndex === colIndex ? 'selected' : ''}
                            ${dragging && seenTiles[rowIndex][colIndex] ? 'dragged' : ''}`}
                        onDragStart={() => handleMouseDown(rowIndex, colIndex)}
                        onDragging={() => handleMouseDrag(rowIndex, colIndex)}
                        onDragEnd={() => handleMouseUp(rowIndex, colIndex)}
                        />
                    ))}
                </div>
            ))}
        </div>);
}

export default GameBoard;