import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch, updateIsPlaying, updateCurrentSongId } from "../store/music-store";
import { SongInterface } from "./Songs";
import { PlayIcon, PauseIcon } from "@heroicons/react/20/solid";
import WaveForm from "./WaveForm";
import { convertSecondToMinutesAndSecond } from "../../util/util";


export default function Player()  {
   const [currentSong, setCurrentSong] = useState<SongInterface | null>( null );
   const { firstSongId, currentSongId, allSongs, isPlaying, currentDuration } = useAppSelector( state => state.music );
   const [isSongLoaded, setIsSongLoaded] = useState( false );
   const [songDuration, setSongDuration] = useState<null | number>( null );
   const [songId, setSongId] = useState<null | number>( null );
   const dispatch = useAppDispatch();

   useEffect(() => {
      let id;
      if( currentSongId === null )  {
         id = firstSongId;
      } else if( currentSongId ) {
         id = currentSongId;
      }

      if( !id || !allSongs[id] )  return
      setCurrentSong( allSongs[id] );
      setSongId( id );

   }, [currentSongId, firstSongId]);

   if( !currentSong || !songId )  return<></>

   return(
      <div className="fixed left-0 right-0 bottom-0 z-50 bg-black">
         <div className="grid grid-cols-[55px_auto_1fr_1fr_120px_1fr] gap-x-4 md:gap-x-6 items-center p-3 md:p-6 border-b border-white/10">
            <img className="w-full aspect-square" src={currentSong.thumb} />
            <div>
               { ( !isPlaying ) &&
                  <PlayIcon className="w-5 h-5 cursor-pointer"
                     onClick={() => {
                        if( !isSongLoaded )  return
                        if( !currentSongId && songId ) dispatch( updateCurrentSongId( songId ) )
                        dispatch( updateIsPlaying( true ) );
                     }}
                  />
               }
               { ( isPlaying ) &&
                  <PauseIcon className="w-5 h-5 cursor-pointer"
                     onClick={() => dispatch( updateIsPlaying( false ))}
                  />
               }
            </div>
            <p>
               <span className="ellipsis">{currentSong.name}</span>
               <span className="block ellipsis text-white/50">{currentSong.artis_name}</span>
            </p>
            <p className="ellipsis text-white/50">{Array.isArray( currentSong.flt_name ) && currentSong.flt_name.join( ", " )}</p>
            <p className="text-center text-white/50">
               {( currentDuration ) && convertSecondToMinutesAndSecond( currentDuration) }
               {!currentDuration && "00:00" }
               {( songDuration ) && ' / '}
               {songDuration && convertSecondToMinutesAndSecond( songDuration )}
            </p>
            <WaveForm
               songId={songId}
               audioUrl={currentSong.audio}
               play={isPlaying}
               isActive={true}
               setDuration={setSongDuration}
               afterSongLoaded={() => setIsSongLoaded( true )}
               mute={true}
               updateTime={false}
            />
         </div>
      </div>
   )
}
