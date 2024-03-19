import React from 'react';

const ImageContext = React.createContext({
    imageData: [],
    dialogOpen: false,
    setDialogOpen: (item) => {},
    setImageData: (item) => {},
});

export default ImageContext;