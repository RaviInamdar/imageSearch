import React from 'react';

const ImageContext = React.createContext({
    imageData: [],
    setImageData: (item) => {},
});

export default ImageContext;