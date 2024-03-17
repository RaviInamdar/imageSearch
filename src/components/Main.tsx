import React, { useContext, useState, useRef } from "react";
import ImageContext from "../store/ImageContext";
import { Button, ImageList, ImageListItem, AppBar, Toolbar, TextField, Dialog, Typography, IconButton, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
// need to add icons

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
    const {imageData, input, setInput, setImageData} = useContext(ImageContext);
    const textRef = useRef(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [sortBy, setSortBy] = useState('time');
    const [topPosts, setTopPosts] = useState('all');
    const [zoomIn, setZoomIn] = useState(false);
    console.log("sortby is", sortBy, 'and topPosts are', topPosts);

    // call that updates when we update query string
    const updateQuery = ({searchString, sort, window}: SearchProps) => {
        console.log('updateQuery', searchString, sort, window);
        fetch(`https://api.imgur.com/3/gallery/search/${sort}/${window}?q=${searchString}`, {
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

    const handleClick = () => {
        updateQuery({searchString: textRef?.current?.value, sort: sortBy, window: topPosts});
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
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Click To {zoomIn ? 'Zoom Out' : 'Zoom In'}
                    </Typography>
                    <Button 
                        autoFocus 
                        color="inherit" 
                        onClick={() => { setDialogOpen(false);}}
                    >
                        save
                    </Button>
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
            <AppBar>
                <Toolbar style={{ justifyContent: 'center' }}>
                    <div style={{ display: 'flex', width: '75%', justifyContent: 'space-between', flexDirection: 'row'}}>
                        <TextField 
                          fullWidth 
                          label="Search to find images!" 
                          inputProps={{ style: { color: '#fff' }}}
                          InputLabelProps={{
                            style: { color: '#fff' },
                          }}
                          inputRef={textRef} 
                          onChange={() => {
                            setInput(textRef.current?.value);
                          }}
                          onKeyDown={(event) => {
                            if(event.key === 'Enter') {
                              handleClick();
                            }
                          }}
                          sx={{  
                            input: {
                                color: "#fff",
                                border: '#fff',
                            }
                          }}
                          variant="outlined"
                        />
                        <Button variant="contained" onClick={handleClick} disabled={input.length < 1} sx={{ color: '#fff' }}>Search</Button>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="sort-by-label" sx={{ color: '#fff' }}>Sort By</InputLabel>
                            <Select
                                labelId="sort-by-label"
                                id="sort-by-dropdown"
                                value={sortBy}
                                onChange={(e) => {setSortBy(e.target.value)}}
                                label="Sort By"
                                sx={{ color: '#fff' }}
                            >
                                <MenuItem value={'time'}>Time</MenuItem>
                                <MenuItem value={'viral'}>Most Viral</MenuItem>
                                <MenuItem value={'top'}>Top</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="top-posts-label" sx={{ color: '#fff' }}>Top Posts Of:</InputLabel>
                            <Select
                                labelId="top-posts-label"
                                id="top-posts-dropdown"
                                value={topPosts}
                                onChange={(e) => {setTopPosts(e.target.value)}}
                                label="Top Posts Of:"
                                sx={{ color: '#fff' }}
                            >
                                <MenuItem value={'day'}>Day</MenuItem>
                                <MenuItem value={'week'}>Week</MenuItem>
                                <MenuItem value={'month'}>Month</MenuItem>
                                <MenuItem value={'year'}>Year</MenuItem>
                                <MenuItem value={'all'}>All Time</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </Toolbar>
            </AppBar>
            <div style={{ display: 'flex', width: '75%', marginTop: '50px'}}>
                <ImageList variant="masonry" cols={3} gap={8}>
                  {imageData.map((item: any) => {
                    if (item.images_count > 0) {
                        return item.images.map((image) => {
                            console.log('image is', image);
                            return (
                                <ImageListItem key={image.id}>
                                    // need to filter out videos for image-only processing
                                    {image.type !== 'video/mp4' && (
                                        <img
                                            srcSet={`${image.link}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                            src={`${image.link}?w=248&fit=crop&auto=format`}
                                            alt={item.title}
                                            loading="lazy"
                                            onClick={() => {
                                                console.log('clicked!', image.link);
                                                setDialogOpen(true);
                                                setSelectedImage(image.link);
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    )}
                                </ImageListItem>
                            );
                        })
                    }
                  })}
                </ImageList>

            </div>
        </div>
    );
}
export default Main;