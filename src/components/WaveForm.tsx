import { useRef, useEffect, useState, useCallback } from "react";
import { useAppDispatch, updateCurrentDuration } from "../store/music-store";
import WaveSurfer from "wavesurfer.js";

interface WaveFormProps {
   audioUrl: string,
   play: boolean,
   isActive: boolean,
   mute?: boolean,
   setDuration: CallableFunction,
   afterSongLoaded?: CallableFunction
}

export default function WaveForm({ audioUrl, play, isActive, mute = false, setDuration, afterSongLoaded }: WaveFormProps ) {
   const ref = useRef<any>( undefined );
   const [waveInstance, setWaveInstance] = useState<null | WaveSurfer>( null );
   const dispatch = useAppDispatch();

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
         if( typeof afterSongLoaded === "function" )  {
            // @ts-ignore
            afterSongLoaded();
         }

         setDuration( instance.getDuration() );
      });

      /** Update current duration of song **/

      const timeout = 300;
      let currentTime: any = Date.now();

      instance.on( "audioprocess", function( currentSongTime ) {
         const diff = Date.now() - currentTime;
         if( diff < timeout )  return

         // console.log( currentSongTime, Date.now() - currentTime );
         currentTime = Date.now();
         dispatch( updateCurrentDuration( currentSongTime ) );
      });

      /** End **/

      if( mute ) instance.setMuted( true )

      setWaveInstance( instance );

      return () => instance.destroy();
   }, []);

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

   return(
     <div ref={ref}></div>
   )
}
