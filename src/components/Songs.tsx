import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SongItem from './SongItem';
import { updateAllSongs, updateFirstSongId, useAppDispatch, useAppSelector, updateCurrentSongId, updateIsPlaying, updateCurrentDuration, updateCurrentSong } from '../store/music-store';
import { callStack } from '../../util/util';

const apiEndPoint = "https://staging2.syncorstream.com/api/fetch_music_json";
const perPage = 8;

interface SongsProps {
   className?: string,
}

export default function Songs({ className }: SongsProps ) {
   const [songs, setSongs] = useState<SongInterface[]>([]);
   const [isLoading, setIsLoading] = useState( false );
   const [hasError, setHasError] = useState( false );
   const [currentPage, setCurrentPage] = useState( 1 );
   const [currentCount, setCurrentCount] = useState( 0 );
   const { songType, filterCategories, search } = useAppSelector( state => state.music );
   const dispatch = useAppDispatch();

   const fetchSongs = useCallback( async () => {
      setHasError( false );
      setIsLoading( true );

      try{
         const response = await axios.post( apiEndPoint, {
            post: songType,
            page: currentPage,
            single_page: "staging2.syncorstream.com",
            categories: filterCategories,
            per_page: perPage,
            user: 155,
            search,
         });

         const result = response;
         const records = result?.data?.records;

         if( typeof result.data.count === "number" ) setCurrentCount( result.data.count );

         if( Array.isArray( records ) )  {
            if( currentPage === 1 )  {
               setSongs( records );
            } else if( currentPage > 1 )  {
               setSongs( state => [...state, ...records] );
            }
         } else {
            setSongs([]);
         }

         setIsLoading( false );
         // console.log( records );
      } catch( e )  {
         console.error( "unable to fetch songs!!!" );
         setHasError( true );
         setIsLoading( false );
      }
   }, [setSongs, setIsLoading, currentPage, songType, filterCategories, search]);

   const loadMoreSongs = useCallback( async () => {
      try{
         const response = await axios.post( apiEndPoint, {
            post: songType,
            page: currentPage + 1,
            single_page: "staging2.syncorstream.com",
            categories: filterCategories.toString(),
            per_page: perPage,
            user: 155,
         });

         const result = response;
         const records = result?.data?.records;

         if( typeof result.data.count === "number" ) setCurrentCount( result.data.count );

         if( records )  {
            // console.log( records )
            setSongs( state => [...state, ...records] );
            setCurrentPage( state => ++state )
         }

      } catch( e )  {
         console.error( "unable to fetch new songs!!!" );
      }

   }, [currentPage, songType, filterCategories, search]);

   useEffect(() => {
      fetchSongs();

      callStack.empty();
   }, [songType, filterCategories, search]);

   useEffect(() => {
      setCurrentPage( 1 );
      // console.log( filterCategories.toString() );
   }, [songType, filterCategories]);

   let allSongs = {};
   let firstSongId: number | string | null = null;

   const items = songs.map(( song, i ) => {
      // saving first song ID because the way we saving all songs in a object with number as a key
      // because of that it will automatically reorderd song object and we get all songs in sequence
      // but we don't want that, what we want is the first song ID.
      if( i === 0 )  firstSongId = song.id;

      allSongs = {...allSongs, [song.id]: song };
      return <SongItem key={song.id} {...song} />
   });

   useEffect(() => {
      // console.log( allSongs );
      dispatch( updateAllSongs( allSongs ) );

      // first song to be active by default because it need by the bottom music player
      if( typeof firstSongId === 'number' )  dispatch( updateFirstSongId( firstSongId ) );
   }, [songs]);

   // reset
   useEffect(() => {
      setCurrentPage( 1 );

      dispatch( updateCurrentSongId( null ) );
      dispatch( updateFirstSongId( null ) );
      dispatch( updateCurrentSong( null ) );
      dispatch( updateCurrentDuration( null ) );
      dispatch( updateIsPlaying( false ) );
   }, [filterCategories, search, songType]);

   return(
      <div className={`${className ? className + ' ' : ''}`}>
         <div>
            {(!isLoading && !hasError ) && items}
            {(!isLoading && !hasError && items.length === 0 ) && <p>Song not found</p>}
            {(!isLoading && !hasError && items.length > 0 && ( perPage * currentPage ) < currentCount ) &&
               <div className="text-center">
                  <button
                     className="bg-[#0816bf] px-4 py-1 rounded-full font-semibold text-base mt-4"
                     onClick={() => loadMoreSongs()}
                  >
                     LOAD MORE...
                  </button>
               </div>
            }
            {isLoading && <p>Loading...</p>}
            {( !isLoading && hasError ) && <p>Something went wrong please try again.</p>}
         </div>
      </div>
   );
}

export interface SongInterface {
   id: number | string,
   name: string,
   artis_name: string,
   thumb: string,
   audio: string,
   flt_name?: string[],
   alt_yes_n?: number,
}
