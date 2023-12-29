import { useState, useRef, useCallback } from "react";
import { SongInterface } from "./Songs.tsx";
import { PlayIcon, PauseIcon } from "@heroicons/react/20/solid";
import { updateIsPlaying, useAppDispatch, useAppSelector, updateCurrentSongId } from "../store/music-store";
import WaveForm from "./WaveForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faDownload } from "@fortawesome/free-solid-svg-icons";
import SocialShare from "./SocialShare.tsx";
// @ts-ignore
import download from "downloadjs/download.min.js";
import SongInfo from "./SongInfo.tsx";
import { convertSecondToMinutesAndSecond } from "../../util/util.ts";
import useStack from "../hooks/use-stack.ts";

interface SimilarSongProps extends SongInterface {
   nextSongFn: CallableFunction,
}

export default function SimilarSong({ id, name, artis_name, flt_name, thumb, audio, nextSongFn }: SimilarSongProps )  {
   const [isSongLoaded, setIsSongLoaded] = useState( false );
   const [songDuration, setSongDuration] = useState<null | number>( null );
   const { currentSongId, isPlaying, currentDuration } = useAppSelector( state => state.music );
   const dispatch = useAppDispatch();
   const cateElRef = useRef<HTMLSpanElement>( null );
   const isActive = id === currentSongId;
   const [isCurrentStackLoaded, nextStackFnRef] = useStack();

   const afterSongLoaded = useCallback(() => {
      setIsSongLoaded( true );

      if( typeof nextStackFnRef.current === "function" ) nextStackFnRef.current();
   }, []);

   return(
      <div>
         <div className="grid grid-cols-[40px_auto_1fr_auto] md:grid-cols-[55px_auto_1fr_1fr_120px_1fr_auto] gap-x-4 md:gap-x-6 items-center p-3 md:p-6 border-b border-white/10">
            <img className="w-full aspect-square" src={thumb} />
            <div>
               {( ( !isPlaying || !isActive ) && isSongLoaded ) &&
                  <PlayIcon className="w-5 h-5 cursor-pointer"
                     onClick={() => {
                        if( !isSongLoaded ) return

                        dispatch( updateCurrentSongId( id ) );
                        dispatch( updateIsPlaying( true ) );
                     }}
                  />
               }
               {( isActive && isPlaying ) &&
                  <PauseIcon className="w-5 h-5 cursor-pointer"
                     onClick={() => dispatch( updateIsPlaying( false ) )}
                  />
               }
               {!isSongLoaded && <div className="song-loading-spinner w-5" />}
            </div>
            <div className="text-sm md:text-lg flex items-start">
               <div className="flex-grow">
                  <span className="ellipsis mb-1 md:mb-0">{name}</span>
                  <span className="block ellipsis text-white/50" dangerouslySetInnerHTML={{__html:  artis_name}}></span>
               </div>
            </div>
            <p className="text-white/70 !hidden md:!flex items-start">
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
                     if( !cateElRef.current )  return
                     cateElRef.current.classList.toggle( "full-line" );
                  }}
               />
            </p>
            <p className="text-center text-white/50 !hidden md:!block">
               {( !isActive && songDuration ) && '00:00'}
               {( currentDuration && isActive ) && convertSecondToMinutesAndSecond( currentDuration ) }
               {( songDuration ) && ' / '}
               {songDuration && convertSecondToMinutesAndSecond( songDuration )}
            </p>
            {isCurrentStackLoaded &&
            <WaveForm
               className="!hidden md:!block"
               songId={id}
               audioUrl={audio}
               play={isPlaying && isActive}
               isActive={isActive}
               setDuration={setSongDuration}
               afterSongLoaded={() => afterSongLoaded()}
               nextSongFn={nextSongFn}
               updateCurrentSongOnActive={{
                  id,
                  name,
                  thumb,
                  artis_name,
                  audio,
               }}
            />
            }
            {!isCurrentStackLoaded && <span />}
            <div className="grid grid-cols-2 gap-3 md:block text-base md:text-xl text-right text-white/50 md:space-x-4">
               {/* add this icon just for alignment with main song items */}
               <FontAwesomeIcon
                  icon={faDownload}
                  className="opacity-0 !hidden md:!inline-block"
               />
               <SocialShare url={audio} />
               <SongInfo songId={id} />
               <button
                  className="inline-block"
                  onClick={() => download( audio, name )}
               >
                  <FontAwesomeIcon
                     icon={faDownload}
                  />
               </button>
            </div>
         </div>
      </div>
   )
}
