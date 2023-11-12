import { PlayIcon, PauseIcon } from "@heroicons/react/20/solid";
import WaveForm from "./WaveForm";
import { useAppSelector, useAppDispatch, updateCurrentAltSongId, updateIsAltPlaying, updateIsPlaying, updateIsSimPlaying } from "../store/music-store";

interface AltSongProps{
   id: number | string,
   name: string,
   audio: string,
   nextSongFn: CallableFunction,
}

export default function AltSong( { id, name, audio, nextSongFn }: AltSongProps ) {
   const { currentAltSongId, isAltPlaying, isPlaying: isGlobalSongPlaying, isSimPlaying } = useAppSelector( state => state.music );
   const dispatch = useAppDispatch();
   const isActive = currentAltSongId === id;

   return(
      <div className="grid grid-cols-[auto_1fr_1fr] gap-x-4 md:gap-x-6 items-center p-3 md:p-6 border-b border-white/10">
         <div>
            {( !isAltPlaying || !isActive ) &&
               <PlayIcon className="w-5 h-5 cursor-pointer"
                  onClick={() => {
                     if( isGlobalSongPlaying ) dispatch( updateIsPlaying( false ) );

                     if( isSimPlaying ) dispatch( updateIsSimPlaying( false ) );

                     dispatch( updateCurrentAltSongId( id ) );
                     dispatch( updateIsAltPlaying( true ) );
                  }}
               />
            }
            {( isAltPlaying && isActive ) &&
               <PauseIcon className="w-5 h-5 cursor-pointer"
                  onClick={() => dispatch( updateIsAltPlaying( false ) )}
               />
            }
         </div>
         <p className="ellipsis">{name}</p>
         <WaveForm
            audioUrl={audio}
            songId={id}
            isActive={isActive}
            play={isActive && isAltPlaying && !isGlobalSongPlaying}
            setDuration={() => {}}
            updateTime={false}
            updateCurrentDurationOnSeek={false}
            nextSongFn={nextSongFn}
         />
      </div>
   );
}
