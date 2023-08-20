import React from 'react'
import { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import GameBoard from './components/GameBoard'
import './App.css'

function App() {
  const dictionaryURL = 'https://raw.githubusercontent.com/jmlewis/valett/master/scrabble/sowpods.txt';
  const [scrabbleDict, setScrabbleDict] = useState(new Set());

  useEffect(() => {
    console.log("dictionary loaded once");
    fetch(dictionaryURL)
      .then(response => response.text())
      .then(data => {

      const wordsArr = data.split('\n');

      const dict = new Set();
      
      wordsArr.forEach((word) => {
        word = word.trim();
        dict.add(word.toUpperCase());
      });

      setScrabbleDict(dict);
    })
  }, []);

  if (scrabbleDict.size === 0) {
    return <p>Loading...</p>
  } else {
    return (<GameBoard dict={scrabbleDict}/>);
  }
  
}

export default App
