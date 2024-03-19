import React, { useState, useRef } from "react";
import { Button, Slide, AppBar, Toolbar, Dialog, Typography, IconButton } from "@mui/material";
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import { useImages } from "../hooks/images.hooks.ts";
import ImageList from "./ImageList.tsx";
import Header from "./Header.tsx";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface SearchProps {
    searchString: string;
    sort?: string;
    window?: string;
};

const Main = () => {
    // initialize values 
    const [dialogOpen, setDialogOpen] = useState(false);
    const textRef = useRef(null);
    const [sortBy, setSortBy] = useState('time');
    const [topPosts, setTopPosts] = useState('all');
    const [zoomIn, setZoomIn] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');


    // inject from hook
    const { updateQuery } = useImages();

    const handleClear = () => {
        // reset to originals and run query
        setSearchQuery("");
        setSortBy('time');
        setTopPosts('all')
        updateQuery({searchString: ''});
    }

    const handleClick = () => {
        updateQuery({searchString: searchQuery, sort: sortBy, window: topPosts});
    }
    return(
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center'}}>
            <Dialog
                fullScreen
                open={dialogOpen}
                onClose={() => { setDialogOpen(false);}}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => { setDialogOpen(false);}}
                            aria-label="close"
                        >
                        <CloseIcon />
                        </IconButton>
                        <Typography sx={{ marginLeft: '40%' }} variant="h6" component="div">
                            Click To {zoomIn ? 'Zoom Out' : 'Zoom In'}
                        </Typography>
                        {/* 
                         for save functionality to add in future
                        <Button 
                            autoFocus 
                            color="inherit" 
                            onClick={() => { setDialogOpen(false);}}
                        >
                            save
                        </Button> */}
                    </Toolbar>
                </AppBar>
                <div style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
                <img 
                    src={selectedImage} 
                    style={
                        {
                            maxHeight: zoomIn ? 'max-content' : '700px',
                            maxWidth: zoomIn ? 'max-content' : '1000px',
                            objectFit: 'cover',
                            cursor: 'pointer'
                        }
                    } 
                    onClick={() => {setZoomIn(!zoomIn)}}
                />
                </div>
            </Dialog>
            <Header 
                handleClear={handleClear} 
                handleClick={handleClick} 
                searchQuery={searchQuery} 
                setSortBy={setSortBy} 
                setTopPosts={setTopPosts} 
                setSearchQuery={setSearchQuery} 
                textRef={textRef} 
                sortBy={sortBy} 
                topPosts={topPosts} 
            />
            <ImageList 
                setDialogOpen={setDialogOpen}
                handleClear={handleClear} 
                setSelectedImage={setSelectedImage} 
            />
        </div>
    );
}
export default Main;