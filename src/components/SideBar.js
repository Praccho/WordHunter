import React from 'react'
import './SideBar.css'

function SideBar({ wordList, onRandomize, onPlay }) {


    return(
        <div className="sidebar-container">
            <div className="sidebar">
                <h1>WordHunter</h1>
                <div className="control-box">
                    <div className="button randomize" onClick={onRandomize}>Randomize</div>
                    <div className="button play" onClick={onPlay}>Play</div>
                </div>
            </div>
        </div>
    );
}

export default SideBar;