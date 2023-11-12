import axios from "axios";
import { useEffect, useState, useCallback, useId, Dispatch, SetStateAction } from "react";
import AltSong from "./AltSong";
import { ControlledAccordion, AccordionItem, useAccordionProvider } from "@szhsin/react-accordion";
import { useAppDispatch, updateCurrentAltSongId, nextSong, updateIsPlaying, updateIsAltPlaying } from "../store/music-store";

const apiEndPoint = 'https://staging2.syncorstream.com/api/alt_songs_json';

interface AltSongsProps {
   id: number,
   toggle: boolean | null,
   isAccordionActive: Dispatch<SetStateAction<boolean>>,
}

export interface AltSongInterface{
   i_o2: number,
   id: string,
   name: string,
   audio: string,
}

export default function AltSongs({ id, toggle, isAccordionActive }: AltSongsProps ) {
   const [songs, setSongs] = useState<AltSongInterface[]>([]);
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
            data.map( song => song.id = `${id}_alt_${song.i_o2}` );

            setSongs( response.data.records );
         }

      } catch( e ) {
         console.error( 'Unable to fetch alt songs', e );
      }
   }, [id]);

   const nextAltSong =  useCallback(( currentId: string ) => {
      const currentIndex = songs.findIndex( song => song.id === currentId );
      const nextAltSong = songs[currentIndex + 1];

      if( currentIndex !== -1 && nextAltSong ) {
         dispatch( updateCurrentAltSongId( nextAltSong.id ) );
      } else {
         dispatch( updateIsAltPlaying( false ) );
         dispatch( nextSong() );
         dispatch( updateIsPlaying( true ) );
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
               header={({state}) => isAccordionActive( state.isEnter )}
               className="accordion-no-after-header"
            >
            {songs.map( song =>
               <AltSong
                  key={song.id}
                  id={song.id}
                  name={song.name}
                  audio={song.audio}
                  nextSongFn={nextAltSong}
               />
            )}
            </AccordionItem>
         </ControlledAccordion>
      </div>
   )
}
