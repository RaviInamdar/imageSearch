import React from 'react';

const ImageContext = React.createContext({
    imageData: [],
    originalData: [],
    input: "",
    setImageData: () => {},
    setOriginalData: () => {},
    setSearchParam: () => {},
    setInput: () => {}
});

export default ImageContext;