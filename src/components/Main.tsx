import React, { useContext, useState, useRef } from "react";
import ImageContext from "../store/ImageContext";
import { Button, ImageList, Slide, CircularProgress, ImageListItem, AppBar, Toolbar, TextField, Dialog, Typography, IconButton, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';

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
    const {imageData, loading, setLoading, setImageData} = useContext(ImageContext);
    const textRef = useRef(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [sortBy, setSortBy] = useState('time');
    const [topPosts, setTopPosts] = useState('all');
    const [zoomIn, setZoomIn] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // call that updates when we update query string
    const updateQuery = ({searchString, sort, window}: SearchProps) => {
        try {
            setLoading(true);

            // update endpoint URL based on what information we have
            let endpoint = 'https://api.imgur.com/3/gallery/search/?q=cats';
            if (searchString !== ''){
                if (sort === 'top') {
                    endpoint = `https://api.imgur.com/3/gallery/search/${sort}/${window}?q=${searchString}`;
                } else {
                    endpoint = `https://api.imgur.com/3/gallery/search/${sort}/?q=${searchString}`
                }
            }

            fetch(endpoint, {
            mode: 'cors',
            headers: {
                "Authorization": "Client-ID b067d5cb828ec5a",
            },
            }).then(response => response.json())
            .then(responseData => {
                setImageData(responseData.data);
                setLoading(false);
            });
        } catch (error) {
            setLoading(false);
            console.log('error in updating data', error);
        }
    };
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
                    <div style={{ display: 'flex', width: '75%', justifyContent: 'space-between', flexDirection: 'row', marginTop: '10px'}}>
                        <Button 
                            variant="contained" 
                            disabled={!searchQuery || searchQuery.length < 1}
                            sx={{ color: '#fff', marginBottom: '8px', borderTopRightRadius: '0px', borderBottomRightRadius: '0px', borderTopLeftRadiuss: '8px', borderBottomLeftRadius: '8px' }} 
                            onClick={() => {handleClear()}}>
                            Refresh  <RefreshIcon />
                        </Button>
                        <TextField 
                          fullWidth 
                          label="Search to find images!" 
                          inputProps={{ style: { color: '#fff' }}}
                          InputProps={{ style: {borderRadius: '0px' }}}
                          InputLabelProps={{
                            style: { color: '#fff' },
                          }}
                          inputRef={textRef} 
                          onChange={() => {
                            setSearchQuery(textRef.current?.value);
                          }}
                          onKeyDown={(event) => {
                            if(event.key === 'Enter') {
                              handleClick();
                            }
                          }}
                          sx={{  
                            input: {
                                color: "#fff",
                            }
                          }}
                          value={searchQuery}
                          variant="outlined"
                        />
                        <Button 
                            variant="contained" 
                            onClick={handleClick} 
                            disabled={searchQuery.length < 1}
                            sx={{ color: '#fff', marginBottom: '8px', borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px', borderTopRightRadius: '8px', borderBottomRightRardius: '8px' }}
                        >
                            <SearchIcon/> Search
                        </Button>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="sort-by-label" sx={{ color: '#fff' }}>Sort By</InputLabel>
                            <Select
                                labelId="sort-by-label"
                                id="sort-by-dropdown"
                                value={sortBy}
                                onChange={(e) => {
                                    setSortBy(e.target.value);
                                    updateQuery({searchString: searchQuery, sort: e.target.value, window: topPosts});
                                }}
                                label="Sort By"
                                sx={{ color: '#fff' }}
                            >
                                <MenuItem value={'time'}>Time</MenuItem>
                                <MenuItem value={'viral'}>Most Viral</MenuItem>
                                <MenuItem value={'top'}>Top</MenuItem>
                            </Select>
                        </FormControl>
                        {sortBy === 'top' && (
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel id="top-posts-label" sx={{ color: '#fff' }}>Top Posts Of:</InputLabel>
                                <Select
                                    labelId="top-posts-label"
                                    id="top-posts-dropdown"
                                    value={topPosts}
                                    onChange={(e) => {
                                        setTopPosts(e.target.value);
                                        updateQuery({searchString: searchQuery, sort: sortBy, window: e.target.value});
                                    }}
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
                        )}
                    </div>
                </Toolbar>
            </AppBar>
            <div style={{ display: 'flex', width: '75%', marginTop: '75px'}}>
                {!loading ? (
                <ImageList variant="masonry" cols={3} gap={8}>
                  {imageData.length > 0 ? imageData.map((item: any) => {
                    if (item.images_count > 0) {
                        return item.images.map((image) => {
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
                  }) :  (
                    <div style={{paddingTop: '100px'}}> 
                        <div style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                        </div>
                        <Button 
                            variant="text"
                            style={{ padding: '50px' }}
                            onClick={() => {
                                handleClear();
                            }}
                        >
                            No results found. Click to clear search and try again
                        </Button>
                        <div style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: '100px'}}>
                        </div>
                    </div>
                  )}
                </ImageList>) 
                : (
                <div style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: '100px'}}>
                    <CircularProgress />
                </div>
                )}

            </div>
        </div>
    );
}
export default Main;