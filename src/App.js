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
  const [loading, setLoading] = useState(false);

  // react context from where we will pull the data
  const value = {imageData, input, loading, setLoading, setImageData, setInput};


  // initial call that fetches data
  useEffect(() => {
    try {
      setLoading(true);
      fetch('https://api.imgur.com/3/gallery/search/?q=cats', {
        mode: 'cors',
        headers: {
          "Authorization": "Client-ID b067d5cb828ec5a",
        },
      }).then(response => response.json())
        .then(responseData => {
          setImageData(responseData.data);
          setLoading(false);
        });
    } catch(error) {
      setLoading(false);
      console.log('error in loading initial data', error);
    }

  },[]);

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
