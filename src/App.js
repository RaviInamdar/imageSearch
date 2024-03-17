import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from "react";
import Main from './components/Main.tsx';
import {Routes, Route} from "react-router-dom";
import ImageContext from "./store/ImageContext";

function App() {
  // data state that we will touch in application
  const [imageData, setImageData] = useState([]);
  const [input, setInput] = useState('');

  // react context from where we will pull the data
  const value = {imageData, input, setImageData, setInput};

  // initial call that fetches data
  useEffect(() => {
    fetch('https://api.imgur.com/3/gallery/search/?q=cats', {
      mode: 'cors',
      headers: {
        "Authorization": "Client-ID b067d5cb828ec5a",
      },
    }).then(response => response.json())
      .then(responseData => {
        setImageData(responseData.data);
      }).catch(error => {
        console.log("error in fetching images", error);
      });

  },[]);
  
  // call that updates when we update query string
  const updateQuery = (input) => {
    fetch(`https://api.imgur.com/3/gallery/search/?q=${input}`, {
      mode: 'cors',
      headers: {
        "Authorization": "Client-ID b067d5cb828ec5a",
      },
    }).then(response => response.json())
      .then(responseData => {
        setImageData(responseData.data);
      }).catch(error => {
        console.log("error in fetching images", error);
      });

  };

  return (
    <>
      <ImageContext.Provider value={value}>
        <Routes>
          <Route path="/">
            <Route index element={<Main/>}></Route>
             <Route path=":id" element={<Main/>}></Route>
          </Route>
        </Routes>
      </ImageContext.Provider>
    </>
  );
}

export default App;
