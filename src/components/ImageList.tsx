import React, { useContext, useState, useEffect } from 'react';
import { Button, CircularProgress, ImageList as MuiImageList, ImageListItem } from "@mui/material";
import ImageContext from "../store/ImageContext";
import { useImages } from '../hooks/images.hooks.ts';
import InfiniteScroll from "react-infinite-scroller";

interface ImageListProps {
    handleClear: () => void;
    setSelectedImage: (item) => void;
    setDialogOpen: (item) => void;
}

const ImageList = ({handleClear, setSelectedImage, setDialogOpen}: ImageListProps ) => {
    const {imageData} = useContext(ImageContext);
    const {initialLoad, loading} = useImages();

    const itemsPerPage = 20;
    const [hasMore, setHasMore] = useState(true);
    const [records, setrecords] = useState(itemsPerPage);
    const loadMore = () => {
      if (records === imageData.length) {
        setHasMore(false);
      } else {
        setTimeout(() => {
          setrecords(records + itemsPerPage);
        }, 2000);
      }
    };

    // initial call that fetches data
    useEffect(() => {
        initialLoad();
    },[]);

    return (
        <div style={{ display: 'flex', width: '75%', marginTop: '75px'}}>
        {!loading ? (
        <InfiniteScroll
            pageStart={0}
            loadMore={loadMore}
            hasMore={hasMore}
            loader={<CircularProgress />}
            useWindow={false}
        >
            <MuiImageList variant="masonry" cols={3} gap={8}>
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
                                        loading="eager"
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
            </MuiImageList>
        </InfiniteScroll>)
        : (
        <div style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: '100px'}}>
            <CircularProgress />
        </div>
        )}

    </div>        
    )
}
export default ImageList;