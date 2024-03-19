import React from 'react';
import { Button, AppBar, Toolbar, TextField, IconButton, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useImages } from '../hooks/images.hooks.ts';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';


interface HeaderProps {
    handleClear: () => void;
    handleClick: () => void;
    searchQuery: string;
    setSearchQuery: (item) => void;
    setSortBy: (item) => void;
    setTopPosts: (item) => void;
    textRef: any;
    sortBy: string;
    topPosts: string;
}

const Header = ({handleClear, handleClick, searchQuery, setSortBy, setTopPosts, setSearchQuery, textRef, sortBy, topPosts}: HeaderProps) => {
    const { updateQuery } = useImages();

    return(
        <AppBar>
        <Toolbar style={{ justifyContent: 'center' }}>
            <div style={{ 
                display: 'flex', 
                width: '75%', 
                justifyContent: 
                'space-between', 
                flexDirection: 'row', 
                marginTop: '10px'
            }}>
                <Button 
                    variant="contained" 
                    sx={{ 
                        color: '#fff', 
                        marginBottom: '8px', 
                        borderTopRightRadius: '0px', 
                        borderBottomRightRadius: '0px', 
                        borderTopLeftRadiuss: '8px', 
                        borderBottomLeftRadius: '8px',
                        minWidth: '100px',
                    }} 
                    onClick={() => {handleClear()}}>
                    Refresh  <RefreshIcon />
                </Button>
                <TextField 
                  fullWidth 
                  label="Search to find images!" 
                  inputProps={{ style: { color: '#fff' }}}
                  InputProps={{ 
                    style: {borderRadius: '0px' }, 
                    endAdornment: searchQuery.length > 0 
                    ? (<IconButton
                            aria-label="toggle password visibility"
                            onClick={() => {setSearchQuery("")}}
                            edge="end"
                        >
                        <CloseIcon style={{ color: '#fff'}} />
                      </IconButton>) 
                    : undefined}}
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
                    sx={{ 
                        color: '#fff', 
                        marginBottom: '8px', 
                        borderTopLeftRadius: '0px', 
                        borderBottomLeftRadius: '0px', 
                        borderTopRightRadius: '8px', 
                        borderBottomRightRardius: '8px',
                        minWidth: '100px',
                    }}
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
    );

};
export default Header;