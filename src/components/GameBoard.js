import React from "react";
import { ReactDOM } from "react";
import { useState, useEffect } from "react";
import { useSound } from "use-sound";
import Tile from "./Tile";
import { Repeat, update } from "immutable";
import './GameBoard.css';
import SideBar from "./SideBar";
import findMp3 from "../assets/findsound.mp3";

function GameBoard({ dict }) {

    const windowW = window.innerWidth;
    const windowH = window.innerHeight;

    const numRows = 8;
    const tileW = windowH / numRows;
    const numCols = Math.floor((windowW * 0.8) / tileW);
    const boardLen = tileW * numCols;
    const sideBarLen = windowW - boardLen;
    const [playFind] = useSound(findMp3, {playbackRate : 1.95});

    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U",
    "V", "W", "X", "Y", "Z"];
    const dist = [0.077, 0.019, 0.04, 0.034, 0.113, 0.012, 0.028, 0.025, 0.09, 0.002, 0.009, 0.052, 0.029, 0.067, 0.066, 0.03, 0.002, 0.07, 0.096, 0.065, 0.033, 0.009, 0.008, 0.003, 0.016, 0.005];
    const condDists = [[0.002, 0.043, 0.064, 0.036, 0.039, 0.015, 0.036, 0.031, 0.042, 0.005, 0.015, 0.104, 0.058, 0.091, 0.009, 0.043, 0.001, 0.122, 0.062, 0.097, 0.019, 0.019, 0.022, 0.005, 0.013, 0.007],
                        [0.187, 0.051, 0.002, 0.008, 0.127, 0.002, 0.003, 0.005, 0.099, 0.002, 0.004, 0.097, 0.047, 0.013, 0.123, 0.004, 0.0, 0.083, 0.021, 0.012, 0.089, 0.001, 0.005, 0.0, 0.014, 0.0],
                        [0.155, 0.001, 0.018, 0.002, 0.101, 0.0, 0.0, 0.092, 0.144, 0.0, 0.055, 0.032, 0.001, 0.045, 0.128, 0.001, 0.001, 0.056, 0.05, 0.043, 0.053, 0.0, 0.001, 0.002, 0.018, 0.0],
                        [0.095, 0.005, 0.002, 0.033, 0.338, 0.002, 0.01, 0.004, 0.15, 0.001, 0.001, 0.034, 0.004, 0.074, 0.081, 0.003, 0.0, 0.058, 0.042, 0.002, 0.039, 0.002, 0.006, 0.0, 0.014, 0.001],
                        [0.027, 0.02, 0.03, 0.09, 0.031, 0.013, 0.024, 0.028, 0.041, 0.002, 0.018, 0.076, 0.038, 0.078, 0.009, 0.032, 0.001, 0.153, 0.135, 0.079, 0.01, 0.026, 0.012, 0.009, 0.008, 0.01],
                        [0.103, 0.003, 0.0, 0.006, 0.127, 0.114, 0.002, 0.004, 0.175, 0.0, 0.004, 0.087, 0.004, 0.034, 0.109, 0.004, 0.0, 0.066, 0.019, 0.037, 0.078, 0.0, 0.004, 0.001, 0.018, 0.0],
                        [0.115, 0.002, 0.0, 0.012, 0.112, 0.001, 0.045, 0.024, 0.095, 0.0, 0.001, 0.041, 0.005, 0.283, 0.08, 0.001, 0.0, 0.064, 0.052, 0.004, 0.047, 0.0, 0.002, 0.0, 0.015, 0.0],
                        [0.106, 0.004, 0.131, 0.005, 0.138, 0.002, 0.026, 0.001, 0.092, 0.0, 0.005, 0.013, 0.006, 0.011, 0.094, 0.051, 0.0, 0.026, 0.118, 0.098, 0.024, 0.0, 0.019, 0.001, 0.027, 0.0],
                        [0.039, 0.021, 0.056, 0.053, 0.054, 0.024, 0.028, 0.025, 0.001, 0.002, 0.02, 0.085, 0.044, 0.161, 0.029, 0.032, 0.001, 0.075, 0.086, 0.094, 0.011, 0.023, 0.01, 0.006, 0.004, 0.016],
                        [0.244, 0.017, 0.0, 0.026, 0.171, 0.001, 0.004, 0.003, 0.092, 0.003, 0.003, 0.003, 0.002, 0.05, 0.17, 0.006, 0.0, 0.019, 0.01, 0.012, 0.157, 0.0, 0.002, 0.0, 0.003, 0.001],
                        [0.102, 0.007, 0.153, 0.002, 0.17, 0.004, 0.001, 0.01, 0.146, 0.0, 0.007, 0.043, 0.004, 0.063, 0.061, 0.004, 0.0, 0.051, 0.115, 0.005, 0.022, 0.001, 0.01, 0.0, 0.017, 0.0], 
                        [0.156, 0.033, 0.02, 0.02, 0.163, 0.019, 0.019, 0.006, 0.138, 0.0, 0.01, 0.102, 0.005, 0.006, 0.101, 0.026, 0.0, 0.01, 0.035, 0.021, 0.056, 0.003, 0.004, 0.0, 0.045, 0.002],
                        [0.177, 0.033, 0.001, 0.004, 0.166, 0.002, 0.004, 0.005, 0.145, 0.0, 0.002, 0.011, 0.043, 0.009, 0.136, 0.042, 0.0, 0.032, 0.074, 0.005, 0.085, 0.0, 0.002, 0.0, 0.023, 0.0],
                        [0.116, 0.004, 0.024, 0.036, 0.141, 0.006, 0.112, 0.004, 0.221, 0.001, 0.012, 0.005, 0.004, 0.022, 0.102, 0.003, 0.001, 0.014, 0.047, 0.05, 0.055, 0.003, 0.007, 0.0, 0.009, 0.001],
                        [0.011, 0.034, 0.065, 0.038, 0.015, 0.019, 0.03, 0.034, 0.038, 0.004, 0.011, 0.081, 0.054, 0.097, 0.059, 0.051, 0.001, 0.119, 0.055, 0.07, 0.043, 0.02, 0.03, 0.006, 0.008, 0.007],
                        [0.133, 0.003, 0.001, 0.003, 0.141, 0.002, 0.001, 0.047, 0.109, 0.0, 0.002, 0.053, 0.043, 0.008, 0.131, 0.053, 0.0, 0.076, 0.08, 0.022, 0.059, 0.0, 0.003, 0.004, 0.024, 0.0],
                        [0.051, 0.0, 0.018, 0.0, 0.072, 0.0, 0.0, 0.001, 0.07, 0.0, 0.0, 0.002, 0.001, 0.03, 0.026, 0.0, 0.0, 0.017, 0.11, 0.001, 0.597, 0.0, 0.001, 0.0, 0.0, 0.001],
                        [0.142, 0.022, 0.027, 0.026, 0.255, 0.011, 0.023, 0.009, 0.094, 0.0, 0.009, 0.008, 0.012, 0.013, 0.115, 0.028, 0.0, 0.025, 0.051, 0.052, 0.051, 0.004, 0.004, 0.0, 0.017, 0.0],
                        [0.071, 0.005, 0.023, 0.018, 0.219, 0.003, 0.018, 0.039, 0.106, 0.0, 0.019, 0.026, 0.028, 0.042, 0.051, 0.029, 0.002, 0.05, 0.065, 0.111, 0.049, 0.0, 0.009, 0.0, 0.014, 0.0],
                        [0.135, 0.004, 0.025, 0.001, 0.158, 0.007, 0.002, 0.04, 0.141, 0.0, 0.001, 0.02, 0.002, 0.055, 0.08, 0.01, 0.0, 0.062, 0.136, 0.045, 0.049, 0.0, 0.006, 0.003, 0.017, 0.002],
                        [0.043, 0.046, 0.05, 0.033, 0.032, 0.025, 0.033, 0.016, 0.028, 0.007, 0.008, 0.084, 0.062, 0.096, 0.08, 0.042, 0.026, 0.098, 0.098, 0.079, 0.001, 0.005, 0.001, 0.003, 0.002, 0.004],
                        [0.169, 0.003, 0.0, 0.005, 0.338, 0.0, 0.0, 0.001, 0.227, 0.0, 0.002, 0.021, 0.001, 0.022, 0.147, 0.0, 0.0, 0.029, 0.003, 0.002, 0.019, 0.006, 0.0, 0.0, 0.005, 0.001],
                        [0.19, 0.01, 0.002, 0.021, 0.152, 0.005, 0.006, 0.049, 0.093, 0.0, 0.012, 0.023, 0.006, 0.049, 0.214, 0.008, 0.0, 0.032, 0.07, 0.036, 0.003, 0.0, 0.003, 0.001, 0.011, 0.001],
                        [0.124, 0.002, 0.025, 0.0, 0.347, 0.003, 0.001, 0.009, 0.168, 0.0, 0.0, 0.005, 0.002, 0.007, 0.139, 0.037, 0.0, 0.001, 0.006, 0.048, 0.038, 0.0, 0.003, 0.0, 0.034, 0.0],
                        [0.08, 0.019, 0.045, 0.032, 0.067, 0.016, 0.029, 0.047, 0.029, 0.0, 0.015, 0.179, 0.045, 0.043, 0.039, 0.046, 0.0, 0.086, 0.073, 0.075, 0.006, 0.003, 0.008, 0.008, 0.0, 0.009],
                        [0.124, 0.002, 0.003, 0.003, 0.253, 0.0, 0.001, 0.002, 0.288, 0.0, 0.001, 0.02, 0.003, 0.017, 0.099, 0.001, 0.0, 0.006, 0.001, 0.024, 0.027, 0.001, 0.003, 0.0, 0.024, 0.095]];
    
    const pointsDict = {
        3: 100,
        4: 400,
        5: 800,
        6: 1400,
        7: 1800,
        8: 2200,
        9: 2600
    }
    
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
    const [flashTiles, setFlashTiles] = useState(Array(numRows).fill(null).map(() => Array(numCols).fill(0)));

    const handleMouseDown = (rowIndex, colIndex, event) => {
        setSelectedTile(null);
        event.preventDefault();
        if (!playing) {
            setHoverTile(null);
        }
        if (tileLetters[rowIndex][colIndex] != '') {
            const seenTilesCopy = [...seenTiles];
            seenTilesCopy[rowIndex][colIndex] = 1;

            const dragTilesCopy = [...dragTiles];
            const appTile = {letter: tileLetters[rowIndex][colIndex], rowIndex, colIndex};
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
            validNext(rowIndex, colIndex, (dragTiles[dragTiles.length-1]).rowIndex, (dragTiles[dragTiles.length-1]).colIndex)) {

            const seenTilesCopy = [...seenTiles];
            seenTilesCopy[rowIndex][colIndex] = 1;

            const dragTilesCopy = [...dragTiles];
            const appTile = {letter: tileLetters[rowIndex][colIndex], rowIndex, colIndex};
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

    function cleanUp() {
        setFlashTiles(Array(numRows).fill(null).map(() => Array(numCols).fill(0)));
    }

    const handleMouseUp = (rowIndex, colIndex, event) => {
        event.preventDefault();
        if (dragging) {
            if (dragTiles.length >= 3) {
                const userStr = toStr();
                if (dict.has(userStr) && !foundWords.includes(userStr)) {
                    const foundWordsCopy = [...foundWords];
                    foundWordsCopy.push(userStr);
                    foundWordsCopy.sort((a,b) => {return b.length - a.length;})
                    setFoundWords(foundWordsCopy);
                    console.log(userStr + " is a word!");
                    
                    const copyFlashTiles = [...flashTiles];
                    for (let i = 0; i < dragTiles.length; i++) {
                        copyFlashTiles[dragTiles[i].rowIndex][dragTiles[i].colIndex] = 1;
                    }
                    console.log(pointsDict[userStr.length]);
                    setPoints(prevPoints => prevPoints + pointsDict[userStr.length]);
                    playFind();
                    setFlashTiles(copyFlashTiles);
                    setTimeout(cleanUp, 125);
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

    function chooseLetter(pre = null) {
        const choice = Math.random();
        let probs = [...dist];
        if (pre) {
            probs = [...condDists[letters.indexOf(pre)]];
        }
        let i = 0;
        let tot = 0;

        while (i < 26) {
            tot += probs[i]
            if (choice < tot) {
                break;
            }
            i += 1
        } 

        return letters[i];
    }
    
    const handleRandomize = () => {
        if (!playing) {
            let copyTileLetters = [...tileLetters];
            let placedLetterFreq = Array(26).fill(0);
            setFoundWords([]);
            for (let i = 0; i < numRows; i++) {
                for (let j = 0; j < numCols; j++) {
                    if (copyTileLetters[i][j] != "") {
                        let neighbors = []

                        for (let y = i-1; y <= i+1; y++) {
                            for (let x = j-1; x <= j+1; x++) {
                                if (0 <= x && x < numRows && 0 <= y && y < numCols && !(x == i && y == j) && copyTileLetters[i][j] != '') {
                                    neighbors.push(copyTileLetters[i][j])
                                }
                            }
                        }                      

                        if (neighbors.length == 0 || Math.random() <= 0.1) {
                            let chosenLetter = chooseLetter();
                            let lttrInd = letters.indexOf(chosenLetter);
                            while (placedLetterFreq[lttrInd] >= Math.min(2,Math.ceil(dist[lttrInd] / 0.04))) {
                                chosenLetter = chooseLetter();
                                lttrInd = letters.indexOf(chosenLetter);
                            }
                            copyTileLetters[i][j] = chosenLetter;
                            placedLetterFreq[lttrInd] += 1;
                        } else {
                            let chosenPrev = neighbors[Math.floor(Math.random() * neighbors.length)];
                            let chosenLetter = chooseLetter(chosenPrev);
                            let lttrInd = letters.indexOf(chosenLetter);
                            while (placedLetterFreq[lttrInd] >= Math.min(2,Math.ceil(dist[lttrInd] / 0.04))) {
                                chosenLetter = chooseLetter(chosenPrev);
                                lttrInd = letters.indexOf(chosenLetter);
                            }
                            copyTileLetters[i][j] = chosenLetter;
                            placedLetterFreq[lttrInd] += 1;
                        }
                    }
                }
            }
            setTileLetters(copyTileLetters);
            setDragging(false);
            setDragTiles([]);
            setSelectedTile(null);
        }
    }

    const timeLimit = 60;
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    let timerInterval;

    useEffect(() => {
        if (playing) {
            timerInterval = setInterval(() => {
                if (timeLeft <= 0) {
                    setTimeLeft(0);
                    clearInterval(timerInterval);
                    setPlaying(false);
                    setTimeout(() => setTimeLeft(timeLimit), 1000);
                } else {
                    setTimeLeft(prevTimeLeft => prevTimeLeft - 0.5);    
                }
            }, 500);
        } else {
            clearInterval(timerInterval);
        }

        return () => {
            clearInterval(timerInterval);
        };
    }, [playing, timeLeft]);

    function handlePlay() {
        if (!playing) {
            setPoints(0);
            setFoundWords([]);
            setTimeLeft(timeLimit);
            setSelectedTile(null);
            setPlaying(true);
        } else {
            clearInterval(timerInterval);
            setTimeLeft(timeLimit);
            setPlaying(false);
            setFoundWords([]);
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
                                ${hoverTile && hoverTile.rowIndex === rowIndex && hoverTile.colIndex === colIndex ? 'hovering' : ''}
                                ${flashTiles[rowIndex][colIndex] ? 'flash' : ''}`}
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
                playing={playing}
            />
        </div>);
}

export default GameBoard;