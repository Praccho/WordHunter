import React from 'react';
import './SideBar.css';
import Tile from './Tile';
import './GameBoard.css';

function SideBar({ wordList, onRandomize, score, timer, playing, onPlay }) {

    const pointsDict = {
        3: 100,
        4: 400,
        5: 800,
        6: 1400,
        7: 1800,
        8: 2200,
        9: 2600
    }

    let minutes = Math.floor(Math.ceil(timer) / 60);
    let seconds = Math.ceil(timer % 60) % 60;
    if (seconds < 10) {
        seconds = "0" + seconds.toString();
    }

    let playText = "Play";

    if (playing) {
        playText = "Stop";
    }

    return(
        <div className="sidebar-container">
            <div className="sidebar">
                <h1>WordHunter</h1>
                <div className="control-box">
                    <div className={`button play ${playing ? "stop" : ""}`} onClick={onPlay}>{playText}</div>
                    <div className="button randomize" onClick={onRandomize}>Shuffle</div>
                </div>
                <div className="score-box">
                    <div className="points-box">
                        <h3 className="score">SCORE: {score}</h3>
                        <h3 className={`timer ${timer < 10 && timer % 1 == 0 ? "redflash" : ""}`}>{minutes} : {seconds}</h3>
                    </div>
                    <div className="found-words">
                        {wordList.map((s) => (<div className="found-word" key={s}><h4 className="found-string">{s}</h4><h4 className="found-points">{pointsDict[s.length]}</h4></div>))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SideBar;