import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SongItem, { SongInterface } from './SongItem';

export default function Songs() {
   const [songs, setSongs] = useState<SongInterface[]>([]);
   const [isLoading, setIsLoading] = useState( false );
   const [hasError, setHasError] = useState( false );

   const fetchSongs = useCallback( async () => {
      setHasError( false );
      setIsLoading( true );

      try{
         const response = await axios.post("https://staging2.syncorstream.com/api/fetch_music_json", {
            post: 0,
            page: 1,
            single_page: "staging2.syncorstream.com",
            per_page: 15,
            categories: "43,16,189,179,180,209,44,45,17,32,33,181,36,182,37,210,38,39,40,41,190,98,97,96,95,94,93,92,91,90,89,88,87,86,122,123,124,2,70,3,4,138,71,72,73,74,133,75,77,119,78,79,80,81,82,83,84,135,112,114,109,108,111,110,118,113,139,53,6,101,54,55,56,105,104,136,57,117,58,134,7,106,137,59,60,61,66,67,103,115,68,120,62,64,116,63,65,102,69",
            user: 155,
         });

         const result = await response;

         if( result?.data?.records ) setSongs( result.data.records );

         setIsLoading( false );
         console.log( result.data.records );
      } catch( e )  {
         console.error( "unable to fetch songs!!!" );
         setHasError( true );
         setIsLoading( false );
      }
   }, [setSongs, setIsLoading]);

   useEffect(() => {
      fetchSongs();
   }, []);

   return(
      <div>
         {!isLoading && songs.map( song =>
            <SongItem
               key={song.id}
               name={song.name}
               id={song.id}
               artis_name={song.artis_name}
               audio={song.audio}
               thumb={song.thumb}
               flt_name={song.flt_name}
            />
         )}
         {isLoading && <p>Loading...</p>}
         {( !isLoading && hasError ) && <p>Something went wrong please try again.</p>}
      </div>
   );
}
