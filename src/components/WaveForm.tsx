import { useRef, useEffect, useState, useCallback } from "react";
import { useAppDispatch, updateCurrentDuration, updateCurrentDurationSeek, useAppSelector } from "../store/music-store";
import WaveSurfer from "wavesurfer.js";

interface WaveFormProps {
   audioUrl: string,
   play: boolean,
   isActive: boolean,
   mute?: boolean,
   setDuration: CallableFunction,
   afterSongLoaded?: CallableFunction,
   afterUrlChange?: CallableFunction,
   updateTime?: boolean
}

export default function WaveForm({ audioUrl, play, isActive, mute = false, setDuration, afterSongLoaded, afterUrlChange, updateTime = true }: WaveFormProps ) {
   const ref = useRef<any>( undefined );
   const [waveInstance, setWaveInstance] = useState<null | WaveSurfer>( null );
   const dispatch = useAppDispatch();
   const { currentDurationSeek, currentDuration, isPlaying, currentSongId } = useAppSelector( state => state.music );

   // because of wavesurfer traditional callback the state variables
   // doesn't get updated so one solution to use Ref()
   // this temporary or permanent solution
   const activeRef = useRef( isActive );
   activeRef.current = isActive;
   const waveRef = useRef( waveInstance );
   waveRef.current = waveInstance;
   const currentDurationRef = useRef( currentDuration );
   currentDurationRef.current = currentDuration;

   const reUpdateDuration = useCallback(( instance: WaveSurfer ) => {
      if( !currentDuration )  return

      instance.setTime( currentDuration );
   }, [currentDuration]);

   useEffect(() => {
      if( !ref.current )  return

      const instance = WaveSurfer.create({
         container: ref.current,
         url: audioUrl,
         autoplay: false,
         barWidth: 1,
         barHeight: 4,
         height: 40,
         progressColor: "rgba(255, 255, 255, 0.4)",
         waveColor: "rgba(255, 255, 255, 0.7)",
      });

      instance.on( "ready", () => {
         if( typeof afterSongLoaded === "function" )  afterSongLoaded();

         setDuration( instance.getDuration() );
      });

      /** Update current duration of song **/

      if( updateTime )  {
         const timeout = 300;
         let currentTime: any = Date.now();

         instance.on( "audioprocess", function( currentSongTime )  {
            const diff = Date.now() - currentTime;
            if( diff < timeout )  return

            // console.log( currentSongTime, Date.now() - currentTime );
            currentTime = Date.now();
            dispatch( updateCurrentDuration( currentSongTime ) );
         });
      }

      /** End **/

      instance.on( "click", whenClicked );

      instance.on( "seeking", ( currentTime ) => {
         console.log( currentDuration, currentTime );
      })

      if( mute ) instance.setMuted( true )

      setWaveInstance( instance );

      return () => instance.destroy();
   }, []);

   function whenClicked( currentSongTime: number )  {
      if( !activeRef.current || !waveRef.current ) return

      dispatch( updateCurrentDurationSeek( waveRef.current.getCurrentTime() ) );
      // console.log( currentSongTime );
   }
   useEffect(() => {
      if( !waveInstance || !currentDurationSeek || !isActive )  return

      waveInstance.setTime( currentDurationSeek );
   }, [currentDurationSeek]);


   // toggle play pause state
   useEffect(() => {
      if( !waveInstance || !isActive )  return

      if( play )  {
         waveInstance.play();
      } else {
         waveInstance.pause();
      }
   }, [play, isActive]);


   // for pausing previous song
   useEffect(() => {
      if( !waveInstance )  return

      if( waveInstance.isPlaying() && !isActive )  {
         waveInstance.pause();
         waveInstance.setTime( 0 );
      }
   }, [isActive]);


   // when updating music url
   useEffect(() => {
      if( !waveInstance || !audioUrl )  return

      (async () => {
         await waveInstance.load( audioUrl );
         // console.log( currentDuration );
         if( currentDurationRef.current ) waveInstance.setTime( currentDurationRef.current );
         if( play )  {
            await waveInstance.play();
         } else {
            await waveInstance.pause();
         }
      })();

   }, [audioUrl]);

   return(
     <div ref={ref}></div>
   )
}
