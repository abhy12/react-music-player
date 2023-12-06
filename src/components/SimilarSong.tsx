import { useState, useRef } from "react";
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

interface SimilarSongProps extends SongInterface {
   nextSongFn: CallableFunction,
}

export default function SimilarSong({ id, name, artis_name, flt_name, thumb, audio, nextSongFn }: SimilarSongProps )  {
   const [isSongLoaded, setIsSongLoaded] = useState( false );
   const { currentSongId, isPlaying } = useAppSelector( state => state.music );
   const dispatch = useAppDispatch();
   const cateElRef = useRef<HTMLSpanElement>( null );
   const isActive = id === currentSongId;

   return(
      <div>
         <div className="grid grid-cols-[40px_auto_1fr_auto] md:grid-cols-[55px_auto_1fr_1fr_1fr_auto] gap-x-4 md:gap-x-6 items-center p-3 md:p-6 border-b border-white/10">
            <img className="w-full aspect-square" src={thumb} />
            <div>
               {( !isPlaying || !isActive ) &&
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
            </div>
            <div className="text-sm md:text-lg flex items-start">
               <div className="flex-grow">
                  <span className="ellipsis mb-1 md:mb-0">{name}</span>
                  <span className="block ellipsis text-white/50" dangerouslySetInnerHTML={{__html:  artis_name}}></span>
               </div>
            </div>
            <p className="text-white/50 !hidden md:!flex items-start">
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
            <WaveForm
               className="!hidden md:!block"
               songId={id}
               audioUrl={audio}
               play={isPlaying && isActive}
               isActive={isActive}
               setDuration={() => {}}
               afterSongLoaded={() => setIsSongLoaded( true )}
               nextSongFn={nextSongFn}
               updateCurrentSongOnActive={{
                  id,
                  name,
                  thumb,
                  artis_name,
                  audio,
               }}
            />
            <div className="text-base md:text-xl text-right text-white/50 space-x-2 md:space-x-4">
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
