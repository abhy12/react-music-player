import { useState, useEffect, useRef } from "react";
import { SongInterface } from "./Songs.tsx";
import { PlayIcon, PauseIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { updateIsPlaying, updateCurrentSongId, useAppDispatch, useAppSelector, updateIsAltPlaying, updateIsSimPlaying } from "../store/music-store";
import WaveForm from "./WaveForm";
import { convertSecondToMinutesAndSecond } from "../../util/util.ts"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faMusic, faDownload } from "@fortawesome/free-solid-svg-icons";
import SocialShare from "./SocialShare.tsx";
// @ts-ignore
import download from "downloadjs/download.min.js";
import SongInfo from "./SongInfo.tsx";
import AltSongs from "./AltSongs.tsx";
import SimilarSongs from "./SimilarSongs.tsx";

export default function SongItem({ id, name, artis_name, flt_name, thumb, audio, alt_yes_n: altSong }: SongInterface )  {
   const [isSongLoaded, setIsSongLoaded] = useState( false );
   const [songDuration, setSongDuration] = useState<null | number>( null );
   const [isActive, setIsActive] = useState( false );
   const [toggleAltSongs, setToggleAltSongs] = useState<boolean | null>( null );
   const [toggleSimSongs, setToggleSimSongs] = useState<boolean | null>( null );
   const [isAltAccordionActive, setIsAltAccordionActive] = useState( false );
   const { currentSongId, isPlaying, isAltPlaying, isSimPlaying, currentDuration } = useAppSelector( state => state.music );
   const dispatch = useAppDispatch();
   const cateElRef = useRef<HTMLSpanElement>( null );
   const hasAltSongs = altSong === 1 ? true : false;

   useEffect(() => {
      if( currentSongId === id ) {
         setIsActive( true )
      } else if( currentSongId !== id ) {
         setIsActive( false )
      }
   }, [currentSongId]);

   return(
      <div>
         <div className="grid grid-cols-[40px_auto_1fr_auto] md:grid-cols-[55px_auto_1fr_1fr_120px_1fr_auto] gap-x-4 md:gap-x-6 items-center p-3 md:p-6 border-b border-white/10">
            <img className="w-full aspect-square" src={thumb} />
            <div>
               {( !isPlaying || !isActive ) &&
                  <PlayIcon className="w-5 h-5 cursor-pointer"
                     onClick={() => {
                        if( !isSongLoaded ) return

                        if( isAltPlaying ) dispatch( updateIsAltPlaying( false ) );

                        if( isSimPlaying ) dispatch( updateIsSimPlaying( false ) );

                        dispatch( updateIsPlaying( true ) );
                        dispatch( updateCurrentSongId( id ) );
                     }}
                  />
               }
               {( isActive && isPlaying ) &&
                  <PauseIcon className="w-5 h-5 cursor-pointer"
                     onClick={() => dispatch( updateIsPlaying( false ))}
                  />
               }
            </div>
            <div className="text-sm md:text-lg flex items-start">
               <div className="flex-grow">
                  <span className="ellipsis mb-1 md:mb-0">{name}</span>
                  <span className="block ellipsis text-white/50" dangerouslySetInnerHTML={{__html:  artis_name}}></span>
               </div>
               {hasAltSongs &&
               <button
                  className="bg-primary-blue/40 p-2 rounded-full flex-shrink-0"
                  onClick={() => setToggleAltSongs( state => !state ) }
               >
                  <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300${isAltAccordionActive? ' rotate-180': ''}`} />
               </button>
               }
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
            <p className="text-center text-white/50 !hidden md:!block">
               {( !isActive && songDuration ) && '00:00'}
               {( currentDuration && isActive ) && convertSecondToMinutesAndSecond( currentDuration ) }
               {( songDuration ) && ' / '}
               {songDuration && convertSecondToMinutesAndSecond( songDuration )}
            </p>
            <WaveForm
               className="!hidden md:!block"
               songId={id}
               audioUrl={audio}
               play={isPlaying}
               isActive={isActive}
               setDuration={setSongDuration}
               afterSongLoaded={() => setIsSongLoaded( true )}
            />
            <div className="text-base md:text-xl text-right text-white/50 space-x-2 md:space-x-4">
               <SocialShare url={audio} />
               <SongInfo songId={id} />
               <button
                  onClick={() => setToggleSimSongs( state => !state )}
               >
                  <FontAwesomeIcon
                     className="cursor-pointer"
                     icon={faMusic}
                  />
               </button>
               <button
                  className="inline-block"
                  onClick={() => download( audio, name ) }
               >
                  <FontAwesomeIcon
                     icon={faDownload}
                  />
               </button>
            </div>
         </div>
         {hasAltSongs && <AltSongs id={id} toggle={toggleAltSongs} isAccordionActive={setIsAltAccordionActive} />}
         <SimilarSongs id={id} name={name} toggle={toggleSimSongs} />
      </div>
   )
}
