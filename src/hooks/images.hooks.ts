import { useContext, useState } from 'react';
import ImageContext from "../store/ImageContext";


interface SearchProps {
    searchString: string;
    sort?: string;
    window?: string;
};

export const useImages = () => {
    const {setImageData} = useContext(ImageContext);

    const [loading, setLoading] = useState(false);

    const initialLoad = () => {
        try {
            setLoading(true);
            fetch('https://api.imgur.com/3/gallery/search/?q=cats', {
              mode: 'cors',
              headers: {
                "Authorization": "Client-ID b067d5cb828ec5a",
              },
            }).then(response => response.json())
              .then(responseData => {
                setImageData(responseData.data);
                setLoading(false);
              });
          } catch(error) {
            setLoading(false);
            console.log('error in loading initial data', error);
          }
    }

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
    return {
        loading,
        setLoading,
        initialLoad,
        updateQuery
    };
};
