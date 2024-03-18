import React from 'react';

const ImageContext = React.createContext({
    imageData: [],
    originalData: [],
    input: "",
    loading: false,
    setLoading: (item) => {},
    setImageData: (item) => {},
    setOriginalData: (item) => {},
    setSearchParam: (item) => {},
    setInput: (item) => {}
});

export default ImageContext;