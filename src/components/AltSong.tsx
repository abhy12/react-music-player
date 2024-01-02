import { useState, useCallback } from "react";
import { PlayIcon, PauseIcon } from "@heroicons/react/20/solid";
import WaveForm from "./WaveForm";
import { useAppSelector, useAppDispatch, updateCurrentSongId, updateIsPlaying } from "../store/music-store";
import useStack from "../hooks/use-stack.ts";

interface AltSongProps{
   id: number | string,
   name: string,
   artis_name: string,
   thumb: string,
   audio: string,
   nextSongFn: CallableFunction,
}

export default function AltSong( { id, name, artis_name, thumb, audio, nextSongFn }: AltSongProps ) {
   const { currentSongId, isPlaying } = useAppSelector( state => state.music );
   const dispatch = useAppDispatch();
   const isActive = currentSongId === id;
   const [isSongLoaded, setIsSongLoaded] = useState( false );
   const [isCurrentStackLoaded, nextStackFnRef] = useStack();

   const afterSongLoaded = useCallback(() => {
      setIsSongLoaded( true );

      if( typeof nextStackFnRef.current === "function" ) nextStackFnRef.current();
   }, []);

   return(
      <div className="grid grid-cols-[auto_1fr_1fr] gap-x-4 md:gap-x-6 items-center p-3 md:p-6 border-b border-white/10">
         <div>
            {( ( !isPlaying || !isActive ) && isSongLoaded ) &&
               <PlayIcon className="w-5 h-5 cursor-pointer"
                  onClick={() => {
                     if( !isSongLoaded ) return

                     dispatch( updateIsPlaying( true ) );
                     dispatch( updateCurrentSongId( id ) );
                  }}
               />
            }
            {( isPlaying && isActive ) &&
               <PauseIcon className="w-5 h-5 cursor-pointer"
                  onClick={() => dispatch( updateIsPlaying( false ) )}
               />
            }
            {!isSongLoaded && <div className="song-loading-spinner w-5" />}
         </div>
         <p className="ellipsis">{name}</p>
         {isCurrentStackLoaded &&
         <WaveForm
            audioUrl={audio}
            songId={id}
            isActive={isActive}
            play={isActive && isPlaying}
            setDuration={() => {}}
            updateTime={true}
            nextSongFn={nextSongFn}
            afterSongLoaded={() => afterSongLoaded()}
            updateCurrentSongOnActive={{
               id,
               name,
               artis_name,
               thumb,
               audio
            }}
         />
         }
         {!isCurrentStackLoaded && <span className="!hidden md:!block" />}
      </div>
   );
}
