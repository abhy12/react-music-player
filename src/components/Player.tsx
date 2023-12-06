import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch, updateIsPlaying, updateCurrentSongId, updateCurrentSong, nextSong, prevSong, updateCurrentVolume } from "../store/music-store";
import { PlayIcon, PauseIcon } from "@heroicons/react/20/solid";
import WaveForm from "./WaveForm";
import { convertSecondToMinutesAndSecond } from "../../util/util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faForwardStep, faBackwardStep } from "@fortawesome/free-solid-svg-icons";
import { createPortal } from "react-dom";

function PlayerContent() {
   const { firstSongId, currentSongId, currentSong, allSongs, isPlaying, currentDuration } = useAppSelector( state => state.music );
   const [isSongLoaded, setIsSongLoaded] = useState( false );
   const [songDuration, setSongDuration] = useState<null | number>( null );
   const dispatch = useAppDispatch();

   useEffect(() => {
      if( !firstSongId || currentSongId ) return

      const firstSong = allSongs[firstSongId];

      if( !firstSong ) return

      dispatch( updateCurrentSong( firstSong ) );
   }, [currentSongId, firstSongId]);

   // @ts-ignore
   function rangeInputHandler( e: React.FormEvent<HTMLInputElement> ) {
      let timeout: number;

      // @ts-ignore
      return ( e ) => {
         const value = +e.currentTarget.value / 100;
         clearTimeout( timeout );

         timeout = setTimeout(() => {
            dispatch( updateCurrentVolume( value ) );
         }, 100 );
      }
   }

   if( !currentSong ) return<></>

   return(
      <div className="fixed left-0 right-0 bottom-0 z-50 bg-black text-white">
         <div className="grid grid-cols-[40px_auto_auto_auto_1fr] md:grid-cols-[120px_auto_auto_auto_auto_1fr_1fr_auto] gap-x-4 md:gap-x-12 items-center p-3 md:px-12 py-6">
            <img className="w-full md:w-16 aspect-square" src={currentSong.thumb} />
            <div>
               <FontAwesomeIcon
                  icon={faBackwardStep}
                  className="cursor-pointer"
                  onClick={() => dispatch( prevSong() )}
               />
            </div>
            <div>
               {( !isPlaying ) &&
                  <PlayIcon className="w-5 h-5 cursor-pointer"
                     onClick={() => {
                        if( !isSongLoaded ) return

                        if( !currentSongId ) dispatch( updateCurrentSongId( currentSong.id ) )

                        dispatch( updateIsPlaying( true ) );
                     }}
                  />
               }
               {( isPlaying ) &&
                  <PauseIcon className="w-5 h-5 cursor-pointer"
                     onClick={() => dispatch( updateIsPlaying( false ) )}
                  />
               }
            </div>
            <div>
               <FontAwesomeIcon
                  icon={faForwardStep}
                  className="cursor-pointer"
                  onClick={() => dispatch( nextSong() )}
               />
            </div>
            <p className="text-center text-white/50 !hidden md:!block">
               {( currentDuration ) && convertSecondToMinutesAndSecond( currentDuration) }
               {!currentDuration && "00:00" }
               {( songDuration ) && ' / '}
               {songDuration && convertSecondToMinutesAndSecond( songDuration )}
            </p>
            <p className="!hidden md:!block">
               <span className="ellipsis">{currentSong.name}</span>
               <span className="block ellipsis text-white/50" dangerouslySetInnerHTML={{__html: currentSong.artis_name}}></span>
            </p>
            <WaveForm
               songId={currentSong.id}
               audioUrl={currentSong.audio}
               play={isPlaying}
               isActive={true}
               setDuration={setSongDuration}
               afterSongLoaded={() => setIsSongLoaded( true )}
               mute={true}
               updateTime={false}
               nextSongOnFinish={false}
            />
            <div className="!hidden md:!block">
               <input
                  // @ts-ignore
                  onChange={rangeInputHandler()}
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="100"
               />
            </div>
         </div>
      </div>
   )
}

export default function Player() {
   const playerContainer = document.getElementById( "global-music-player" );

   if( !playerContainer )  return <></>

   return(
      <>
         {createPortal( <PlayerContent />, playerContainer )}
      </>
   )
}
