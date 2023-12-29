import { useState, useEffect, useRef, useCallback } from "react";
import { SongInterface } from "./Songs.tsx";
import { PlayIcon, PauseIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { updateIsPlaying, updateCurrentSongId, useAppDispatch, useAppSelector } from "../store/music-store";
import WaveForm from "./WaveForm";
import { convertSecondToMinutesAndSecond } from "../../util/util.ts"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faMusic, faDownload } from "@fortawesome/free-solid-svg-icons";
import SocialShare from "./SocialShare.tsx";
import SongInfo from "./SongInfo.tsx";
import AltSongs from "./AltSongs.tsx";
import SimilarSongs from "./SimilarSongs.tsx";
import useStack from "../hooks/use-stack.ts";

export default function SongItem({ id, name, artis_name, flt_name, thumb, audio, alt_yes_n: altSong }: SongInterface )  {
   const [isSongLoaded, setIsSongLoaded] = useState( false );
   const [songDuration, setSongDuration] = useState<null | number>( null );
   const [isActive, setIsActive] = useState( false );
   const [toggleAltSongs, setToggleAltSongs] = useState<boolean | null>( null );
   const [toggleSimSongs, setToggleSimSongs] = useState<boolean | null>( null );
   const [isAltAccordionActive, setIsAltAccordionActive] = useState( false );
   const { currentSongId, isPlaying, currentDuration } = useAppSelector( state => state.music );
   const dispatch = useAppDispatch();
   const cateElRef = useRef<HTMLSpanElement>( null );
   const hasAltSongs = altSong === 1 ? true : false;
   const [isCurrentStackLoaded, nextStackFnRef] = useStack();

   useEffect(() => {
      if( currentSongId === id ) {
         setIsActive( true )
      } else if( currentSongId !== id ) {
         setIsActive( false )
      }
   }, [currentSongId]);


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

                        dispatch( updateIsPlaying( true ) );
                        dispatch( updateCurrentSongId( id ) );
                     }}
                  />
               }
               {( isActive && isPlaying ) &&
                  <PauseIcon className="w-5 h-5 cursor-pointer"
                     onClick={() => dispatch( updateIsPlaying( false ) )}
                  />
               }
               {!isSongLoaded && <div className="spinner w-4" />}
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
               play={isPlaying}
               isActive={isActive}
               setDuration={setSongDuration}
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
            {!isCurrentStackLoaded && <span />}
            <div className="grid grid-cols-2 gap-3 md:block text-base md:text-xl text-right text-white/50 md:space-x-4 ">
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
               <a
                  className="inline-block"
                  href="/pricing"
               >
                  <FontAwesomeIcon
                     icon={faDownload}
                  />
               </a>
            </div>
         </div>
         {hasAltSongs &&
         <AltSongs
            id={id}
            artis_name={artis_name}
            thumb={thumb}
            toggle={toggleAltSongs}
            isAccordionActive={setIsAltAccordionActive}
         />
         }
         <SimilarSongs id={id} name={name} toggle={toggleSimSongs} />
      </div>
   )
}
