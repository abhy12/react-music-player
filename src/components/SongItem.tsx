import { useState, useEffect, useRef } from "react";
import { SongInterface } from "./Songs.tsx";
import { PlayIcon, PauseIcon } from "@heroicons/react/20/solid";
import { updateIsPlaying, updateCurrentSongId, useAppDispatch, useAppSelector } from "../store/music-store";
import WaveForm from "./WaveForm";
import { convertSecondToMinutesAndSecond } from "../../util/util.ts"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";


export default function SongItem({ id, name, artis_name, flt_name, thumb, audio }: SongInterface )  {
   const [isSongLoaded, setIsSongLoaded] = useState( false );
   const [songDuration, setSongDuration] = useState<null | number>( null );
   const [isActive, setIsActive] = useState( false );
   const { currentSongId, isPlaying, currentDuration } = useAppSelector( state => state.music );
   const dispatch = useAppDispatch();
   const cateElRef = useRef<HTMLSpanElement>( null );

   useEffect(() => {
      if( currentSongId === id )  setIsActive( true )

      else if( currentSongId !== id ) setIsActive( false )
   }, [currentSongId]);

   return(
      <div className="grid grid-cols-[55px_auto_1fr_1fr_120px_1fr] gap-x-4 md:gap-x-6 items-center p-3 md:p-6 border-b border-white/10">
         <img className="w-full aspect-square" src={thumb} />
         <div>
            { ( !isPlaying || !isActive ) &&
               <PlayIcon className="w-5 h-5 cursor-pointer"
                  onClick={() => {
                     if( !isSongLoaded )  return
                     dispatch( updateIsPlaying( true ) );
                     dispatch( updateCurrentSongId( id ) );
                  }}
               />
            }
            { ( isActive && isPlaying ) &&
               <PauseIcon className="w-5 h-5 cursor-pointer"
                  onClick={() => dispatch( updateIsPlaying( false ))}
               />
            }
         </div>
         <p>
            <span className="ellipsis">{name}</span>
            <span className="block ellipsis text-white/50">{artis_name}</span>
         </p>
         <p className="text-white/50 flex items-start">
            <span
               className="grow mr-2 ellipsis ellipsis-2"
               ref={cateElRef}
            >
               {Array.isArray( flt_name ) && flt_name.join( ", " )}
            </span>
            <FontAwesomeIcon
               icon={faCirclePlus}
               className="text-xl shrink-0 w-8 cursor-pointer"
               onClick={() => {
                  if( !cateElRef.current ) return
                  cateElRef.current.classList.toggle( "full-line" );
               }}
            />
         </p>
         <p className="text-center text-white/50">
            {( !isActive && songDuration ) && '00:00'}
            {( currentDuration && isActive ) && convertSecondToMinutesAndSecond( currentDuration ) }
            {( songDuration ) && ' / '}
            {songDuration && convertSecondToMinutesAndSecond( songDuration )}
         </p>
         <WaveForm
            songId={id}
            audioUrl={audio}
            play={isPlaying}
            isActive={isActive}
            setDuration={setSongDuration}
            afterSongLoaded={() => setIsSongLoaded( true )}
         />
      </div>
   )
}
