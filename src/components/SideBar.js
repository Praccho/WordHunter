import React from 'react'
import './SideBar.css'

function SideBar({ wordList, onRandomize, onPlay, score, timer }) {

    let minutes = Math.floor(timer / 60);
    let seconds = timer % 60;
    if (seconds < 10) {
        seconds = "0" + seconds.toString();
    }

    function tilify(word) {
        for (let i = 0; i < word.length; i++) {

        }
    }
    
    return(
        <div className="sidebar-container">
            <div className="sidebar">
                <h1>WordHunter</h1>
                <div className="control-box">
                    <div className="button play" onClick={onPlay}>Play</div>
                    <div className="button randomize" onClick={onRandomize}>Shuffle</div>
                </div>
                <div className="score-box">
                    <div className="points-box">
                        <h3 className="score">SCORE: {score}</h3>
                        <h3 className="timer">{minutes} : {seconds}</h3>
                    </div>
                    <div className="found-words">

                    </div>
                </div>
            </div>
        </div>
    );
}

export default SideBar;