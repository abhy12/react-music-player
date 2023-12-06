import axios from "axios";
import { useEffect, useState, useCallback, useId } from "react";
import SimilarSong from "./SimilarSong";
import { ControlledAccordion, AccordionItem, useAccordionProvider } from "@szhsin/react-accordion";
import { useAppDispatch, nextSong, updateCurrentSongId } from "../store/music-store";
import { SongInterface } from "./Songs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const apiEndPoint = 'https://staging2.syncorstream.com/api/sim_song_json';

interface AltSongsProps {
   id: number | string,
   toggle: boolean | null,
   name: string,
}

export default function SimilarSongs({ id, name, toggle }: AltSongsProps ) {
   const [songs, setSongs] = useState<SongInterface[]>([]);
   const dispatch = useAppDispatch();
   const accordionId = useId();
   const accordionProviderValue = useAccordionProvider({
      transition: true,
      transitionTimeout: 300,
   });
   const { toggle: accordionToggle } = accordionProviderValue;

   const fetchAltSongs = useCallback( async () => {
      try{
         const response = await axios.post( apiEndPoint, {
            id,
            post: 1,
            single: 'syncorstream.com',
            user: 155,
         });

         const data = response.data.records;
         // console.log( data );

         if( data && Array.isArray( data ) ) {
            data.map( song => song.id = `${id}_sim_${song.id}` );

            setSongs( response.data.records );
         }

      } catch( e ) {
         console.error( 'Unable to fetch alt songs', e );
      }
   }, [id]);

   const nextSimSong =  useCallback(( currentId: string ) => {
      const currentIndex = songs.findIndex( song => song.id === currentId );
      const nextSimSong = songs[currentIndex + 1];

      if( currentIndex !== -1 && nextSimSong ) {
         dispatch( updateCurrentSongId( nextSimSong.id ) );
      } else {
         dispatch( nextSong() );
      }
   }, [songs]);

   useEffect(() => {
      if( toggle === null ) return

      if( songs.length === 0 ) {
         fetchAltSongs();
      } else if( songs.length > 0 ) {
         accordionToggle( accordionId );
      }
   }, [toggle]);

   useEffect(() => {
      if( songs.length > 0 ) {
         accordionToggle( accordionId );
      }
   }, [songs]);

   return(
      <div>
         <ControlledAccordion
            providerValue={accordionProviderValue}
         >
            <AccordionItem
               itemKey={accordionId}
               // @ts-ignore
               header={({state}) => {}}
               className="accordion-no-after-header"
            >
            <div className="flex items-center justify-between">
               <p className="my-2 md:mt-3 text-base md:text-lg font-semibold">Similar songs to {name}</p>
               <button
                  onClick={() => accordionToggle( accordionId )}
               >
                  <FontAwesomeIcon
                     icon={faXmark}
                  />
               </button>
            </div>
            {songs.map( song =>
               <SimilarSong
                  key={song.id}
                  {...song}
                  nextSongFn={nextSimSong}
               />
            )}
            </AccordionItem>
         </ControlledAccordion>
      </div>
   )
}
