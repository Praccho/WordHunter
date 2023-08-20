import React from "react";
import { ReactDOM } from "react";
import { useState, useEffect } from "react";
import Tile from "./Tile";
import { Repeat, update } from "immutable";
import './GameBoard.css';

function GameBoard({ dict }) {

    const windowW = window.innerWidth;
    const windowH = window.innerHeight;

    const numRows = 8;
    const tileW = windowH / numRows;
    const numCols = Math.floor((windowW * 0.8) / tileW);
    const boardLen = tileW * numCols;
    const sideBarLen = windowW - boardLen;
    
    const [tileLetters, setTileLetters] = useState(Array(numRows).fill(null).map(() => Array(numCols).fill('')));
    const [selectedTile, setSelectedTile] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [dragTiles, setDragTiles] = useState([]);
    const [seenTiles, setSeenTiles] = useState(Array(numRows).fill(null).map(() => Array(numCols).fill(0)));
    const [dragging, setDragging] = useState(false);
    const [foundWords, setFoundWords] = useState([]);

    const handleMouseDown = (rowIndex, colIndex, event) => {
        event.preventDefault();
        if (tileLetters[rowIndex][colIndex] != '') {
            const seenTilesCopy = [...seenTiles];
            seenTilesCopy[rowIndex][colIndex] = 1;

            const dragTilesCopy = [...dragTiles];
            const appTile = {letter: tileLetters[rowIndex][colIndex], row: rowIndex, col: colIndex};
            dragTilesCopy.push(appTile)
            
            if (selectedTile && (selectedTile.rowIndex != rowIndex || selectedTile.colIndex != colIndex)) {
                setSelectedTile(false);             
            }
            setDragging(true);
            setSeenTiles(seenTilesCopy);
            setDragTiles(dragTilesCopy);
        }
    }

    function validNext(row, col, prevR, prevC) {
        return Math.abs(row - prevR) <= 1 && Math.abs(col - prevC) <= 1
    }

    const handleMouseDrag = (rowIndex, colIndex, event) => {
        event.preventDefault();
        if (dragging && !seenTiles[rowIndex][colIndex] && tileLetters[rowIndex][colIndex] != '' &&
            validNext(rowIndex, colIndex, (dragTiles[dragTiles.length-1]).row, (dragTiles[dragTiles.length-1]).col)) {

            const seenTilesCopy = [...seenTiles];
            seenTilesCopy[rowIndex][colIndex] = 1;

            const dragTilesCopy = [...dragTiles];
            const appTile = {letter: tileLetters[rowIndex][colIndex], row: rowIndex, col: colIndex};
            dragTilesCopy.push(appTile)
            
            setSeenTiles(seenTilesCopy);
            setDragTiles(dragTilesCopy);
        }
    }

    function toStr() {
        let ret = ""
        for (let i = 0; i < dragTiles.length; i++) {
            ret += dragTiles[i].letter;
        }
        return ret;
    }

    const handleMouseUp = (rowIndex, colIndex, event) => {
        event.preventDefault();
        // drag ends on same key (aka select)
        if (dragging) {
            if (dragTiles.length >= 3) {
                const userStr = toStr();
                if (dict.has(userStr)) {
                    // log scores
                    const foundWordsCopy = [...foundWords];
                    foundWordsCopy.push(userStr);
                    setFoundWords(foundWordsCopy);
                    console.log(userStr + " is a word!");
                }
            }

            setSeenTiles(Array(numRows).fill(null).map(() => Array(numCols).fill(0)));
            setDragging(false);
            setDragTiles([]);
        }
        if (dragTiles.length <= 1 && !selectedTile && (!selectedTile && !(selectedTile && selectedTile.rowIndex === rowIndex && selectedTile.colIndex === colIndex))) {
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
    const navBarContainerStyle = {
        width: boardLen
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
                            ${dragging && seenTiles[rowIndex][colIndex] ? 'dragged' : ''}
                            ${dragging && dragTiles.length >= 3 && foundWords.includes(toStr()) ? 'is-found' : ''}
                            ${dragging && dragTiles.length >= 3 && dict.has(toStr()) && !foundWords.includes(toStr()) ? 'is-word' : ''}`}                       
                        onDragStart={(e) => handleMouseDown(rowIndex, colIndex, e)}
                        onDragging={(e) => handleMouseDrag(rowIndex, colIndex, e)}
                        onDragEnd={(e) => handleMouseUp(rowIndex, colIndex, e)}
                        />
                    ))}
                </div>
            ))}
        </div>);
}

export default GameBoard;