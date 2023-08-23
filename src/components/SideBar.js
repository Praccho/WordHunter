import React from 'react'
import './SideBar.css'

function SideBar({ wordList, onRandomize, score, timer, playing, onPlay }) {

    let minutes = Math.floor(timer / 60);
    let seconds = Math.min(59, Math.ceil(timer % 60));
    if (seconds < 10) {
        seconds = "0" + seconds.toString();
    }

    function tilify(word) {
        for (let i = 0; i < word.length; i++) {

        }
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

                    </div>
                </div>
            </div>
        </div>
    );
}

export default SideBar;