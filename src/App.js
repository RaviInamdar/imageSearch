import logo from './logo.svg';
import './App.css';
import React, {useState} from "react";
import Main from './components/Main.tsx';
import {Routes, Route} from "react-router-dom";
import ImageContext from "./store/ImageContext";

function App() {
  // data state that we will touch in application
  const [imageData, setImageData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // react context from where we will pull the data
  const value = {
    imageData, 
    loading, 
    dialogOpen, 
    setDialogOpen, 
    setLoading, 
    setImageData, 
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
