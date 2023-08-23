import React from "react";
import { ReactDOM } from "react";
import { useState, useEffect } from "react";
import Tile from "./Tile";
import { Repeat, update } from "immutable";
import './GameBoard.css';
import SideBar from "./SideBar";

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
    const [points, setPoints] = useState(0);
    const [hoverTile, setHoverTile] = useState(null);
    const [playing, setPlaying] = useState(false);

    const handleMouseDown = (rowIndex, colIndex, event) => {
        event.preventDefault();
        if (!playing) {
            setHoverTile(null);
        }
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

    const handleMouseEnter = (rowIndex, colIndex) => {
        if (!dragging && (!selectedTile || (selectedTile.rowIndex !== rowIndex || selectedTile.colIndex !== colIndex))) {
            setHoverTile({rowIndex, colIndex});
        }
    }

    const handleMouseLeave = (rowIndex, colIndex) => {
        setHoverTile(null);
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
        if (dragging) {
            if (dragTiles.length >= 3) {
                const userStr = toStr();
                if (dict.has(userStr)) {
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
        if (!playing && dragTiles.length <= 1 && (!selectedTile || !(selectedTile && selectedTile.rowIndex === rowIndex && selectedTile.colIndex === colIndex))) {
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
            } else if (["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) {
                switch (e.key) {
                    case "ArrowDown":
                        if (selectedTile.rowIndex < numRows-1) {
                            setSelectedTile({rowIndex: selectedTile.rowIndex+1, colIndex: selectedTile.colIndex});
                        } else {
                            setSelectedTile({rowIndex: 0, colIndex: selectedTile.colIndex});
                        }
                        break;
                    case "ArrowUp":
                        if (selectedTile.rowIndex > 0) {
                            setSelectedTile({rowIndex: selectedTile.rowIndex-1, colIndex: selectedTile.colIndex});
                        } else {
                            setSelectedTile({rowIndex: numRows-1, colIndex: selectedTile.colIndex});
                        }
                        break;
                    case "ArrowRight":
                        if (selectedTile.colIndex < numCols-1) {
                            setSelectedTile({rowIndex: selectedTile.rowIndex, colIndex: selectedTile.colIndex+1})
                        } else {
                            setSelectedTile({rowIndex: selectedTile.rowIndex, colIndex: 0})
                        }
                        break;
                    case "ArrowLeft":
                        if (selectedTile.colIndex > 0) {
                            setSelectedTile({rowIndex: selectedTile.rowIndex, colIndex: selectedTile.colIndex-1})
                        } else {
                            setSelectedTile({rowIndex: selectedTile.rowIndex, colIndex: numCols-1})
                        }
                        break;
                }
            }
            
            setTileLetters(updatedTileLetters);
            setInputValue('');
        }
    }

    useEffect(() => {
        window.addEventListener('keyup', handleKeyUp);
    
        return () => {
            window.removeEventListener('keyup', handleKeyUp);
        };
    });

    function chooseLetter() {
        const dist = [0.07731374380541041, 0.018591136849393716, 0.04008549329386925, 0.033549712527031025, 0.1128035206449643,
            0.01191899750114058, 0.028024242748140197, 0.024997632390625288, 0.09034050741896783, 0.001666168257058325,
            0.009381234622819196, 0.05229764209684131, 0.028964606106428068, 0.06692180523043224, 0.06629738509824695,
            0.030011069801839936, 0.001690139073964117, 0.06983013336026449, 0.09628212629791168, 0.065228129478564,
            0.033092302184763125, 0.009202435906554682, 0.007689130727797228, 0.002835629750691715, 0.0161598672724079,
            0.004825207553872446];
        const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U",
                        "V", "W", "X", "Y", "Z"];
        const choice = Math.random();
        let i = 0;
        let tot = 0;

        while (choice > tot) {
            tot += dist[i]
            i += 1
        } 

        return letters[i-1];
    }
    
    const handleRandomize = () => {
        if (!playing) {
            let copyTileLetters = [...tileLetters];
            for (let i = 0; i < numRows; i++) {
                for (let j = 0; j < numCols; j++) {
                    if (copyTileLetters[i][j] != "") {
                        copyTileLetters[i][j] = chooseLetter();
                    }
                }
            }
            setTileLetters(copyTileLetters);
            setDragging(false);
            setDragTiles([]);
            setSelectedTile(null);
        }
    }

    const timeLimit = 90;
    const [timeLeft, setTimeLeft] = useState(timeLimit);

    useEffect(() => {
        let timerInterval;

        if (playing) {
            timerInterval = setInterval(() => {
                if (timeLeft <= 0) {
                    setTimeLeft(0);
                    clearInterval(timerInterval);
                    setPlaying(false);
                } else {
                    setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
                }
            }, 1000);
        } else {
            clearInterval(timerInterval);
        }

        return () => {
            clearInterval(timerInterval);
        };
    }, [playing, timeLeft]);

    function handlePlay() {
        if (!playing) {
            setTimeLeft(timeLimit);
            setSelectedTile(null);
            setPlaying(true);
        } 
    }
    
    const navBarContainerStyle = {
        width: boardLen
    }

    return (
        <div className="full-window">
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
                                ${dragging && dragTiles.length >= 3 && dict.has(toStr()) && !foundWords.includes(toStr()) ? 'is-word' : ''}
                                ${hoverTile && hoverTile.rowIndex === rowIndex && hoverTile.colIndex === colIndex ? 'hovering' : ''}`}                       
                            onDragStart={(e) => handleMouseDown(rowIndex, colIndex, e)}
                            onDragging={(e) => handleMouseDrag(rowIndex, colIndex, e)}
                            onDragEnd={(e) => handleMouseUp(rowIndex, colIndex, e)}
                            onMouseIn={() => handleMouseEnter(rowIndex, colIndex)}
                            onMouseOut={() => handleMouseLeave(rowIndex, colIndex)}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <SideBar
                wordList={foundWords}
                onPlay = {() => handlePlay()}
                onRandomize={() => handleRandomize()}
                score={points}
                timer={timeLeft}
            />
        </div>);
}

export default GameBoard;