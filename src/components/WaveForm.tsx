import { useRef, useEffect, useState, useCallback } from "react";
import { useAppDispatch, updateCurrentDuration, updateCurrentDurationSeek, useAppSelector, updateCurrentSongId, updateIsPlaying } from "../store/music-store";
import WaveSurfer from "wavesurfer.js";

interface WaveFormProps {
   songId: number,
   audioUrl: string,
   play: boolean,
   isActive: boolean,
   mute?: boolean,
   setDuration: CallableFunction,
   afterSongLoaded?: CallableFunction,
   updateTime?: boolean
}

export default function WaveForm({ songId, audioUrl, play, isActive, mute = false, setDuration, afterSongLoaded, updateTime = true }: WaveFormProps ) {
   const ref = useRef<any>( undefined );
   const [waveInstance, setWaveInstance] = useState<null | WaveSurfer>( null );
   const dispatch = useAppDispatch();
   const { currentDurationSeek, currentDuration, isPlaying, currentVolume } = useAppSelector( state => state.music );

   // because of wavesurfer traditional callback, the state variables
   // doesn't get updated state on the callback, so one solution to use useRef()
   // this temporary or permanent solution
   const activeRef = useRef( isActive );
   activeRef.current = isActive;
   const waveRef = useRef( waveInstance );
   waveRef.current = waveInstance;
   const currentDurationRef = useRef( currentDuration );
   currentDurationRef.current = currentDuration;
   const playRef = useRef( isPlaying );
   playRef.current = isPlaying;

   const waveFormClickHandler = useCallback(() => {
      if( !waveRef.current ) return

      if( !activeRef.current ) dispatch( updateCurrentSongId( songId ) );

      if( !playRef.current ) dispatch( updateIsPlaying( true ) );

      dispatch( updateCurrentDurationSeek( waveRef.current.getCurrentTime() ) );
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
         fillParent: true,
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

      // don't use "seeking" event it will give
      // some glitch effect when sound is playing
      instance.on( "click", waveFormClickHandler );

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

   // change volume
   useEffect(() => {
      if( !waveInstance || mute )  return

      waveInstance.setVolume( currentVolume );
   }, [currentVolume]);

   return(
     <div ref={ref}></div>
   )
}
