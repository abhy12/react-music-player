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
   updateTime?: boolean
}

export default function WaveForm({ audioUrl, play, isActive, mute = false, setDuration, afterSongLoaded, updateTime = true }: WaveFormProps ) {
   const ref = useRef<any>( undefined );
   const [waveInstance, setWaveInstance] = useState<null | WaveSurfer>( null );
   const dispatch = useAppDispatch();
   const { currentDurationSeek, currentDuration } = useAppSelector( state => state.music );

   // because of wavesurfer traditional callback the state variables
   // doesn't get updated so one solution to use Ref()
   // this temporary or permanent solution
   const activeRef = useRef( isActive );
   activeRef.current = isActive;
   const waveRef = useRef( waveInstance );
   waveRef.current = waveInstance;
   const currentDurationRef = useRef( currentDuration );
   currentDurationRef.current = currentDuration;

   const changeDuration = useCallback(( currentSongTime: number ) => {
      if( !activeRef.current || !waveRef.current ) return

      dispatch( updateCurrentDurationSeek( currentSongTime ) );
      // console.log( currentSongTime );
   }, [activeRef, waveRef]);


   // init wave
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
         instance.on( "audioprocess", function( currentSongTime )  {
            dispatch( updateCurrentDuration( currentSongTime ) );
         });
      }

      /** End **/

      instance.on( "seeking", changeDuration );

      if( mute ) instance.setMuted( true )

      setWaveInstance( instance );

      return () => instance.destroy();
   }, []);


   // update duration when new position seek
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
