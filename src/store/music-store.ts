import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { SongInterface } from "../components/Songs";

interface MusicState  {
   currentSongId: null | number,
   firstSongId: number | null,
   isPlaying: boolean,
   currentDuration: null | number,
   currentDurationSeek: number,
   allSongs: {
      [key: number]: SongInterface
   },
   currentVolume: number,
}

const initialState: MusicState = {
   currentSongId: null,
   firstSongId: null,
   isPlaying: false,
   currentDuration: null,
   currentDurationSeek: 0,
   allSongs: {},
   currentVolume: 1,
}

const musicSlice = createSlice({
   name: 'music',
   initialState,
   reducers: {
      updateCurrentSongId: ( state, action: PayloadAction<MusicState['currentSongId']> ) => {
         state.currentSongId = action.payload;
      },
      updateFirstSongId: ( state, action: PayloadAction<MusicState['firstSongId']> ) => {
         state.firstSongId = action.payload;
      },
      updateIsPlaying: ( state, action: PayloadAction<MusicState['isPlaying']> ) => {
         state.isPlaying = action.payload;
      },
      updateCurrentDuration: ( state, action: PayloadAction<MusicState['currentDuration']> ) => {
         state.currentDuration = action.payload;
      },
      updateCurrentDurationSeek: ( state, action: PayloadAction<MusicState['currentDurationSeek'] > )  => {
         state.currentDurationSeek = action.payload;
      },
      updateAllSongs: ( state, action: PayloadAction<MusicState['allSongs']> ) => {
         state.allSongs = action.payload;
      },
      nextSong: state => {
         if( !state.currentSongId )  return

         // doing reverse because the way we saving all songs
         const keys = Object.keys( state.allSongs ).reverse();
         const currentPosition = +keys.indexOf( state.currentSongId + '' );
         const nextPosition: string | undefined = keys[currentPosition + 1];

         if( !nextPosition )  return

         const nextSongId = +nextPosition;

         state.currentSongId = nextSongId;

         console.log( nextSongId, state.currentSongId , keys );
      },
      prevSong: state => {
         if( !state.currentSongId )  return
         // doing reverse because the way we saving all songs
         const keys = Object.keys( state.allSongs ).reverse();
         const currentPosition = +keys.indexOf( state.currentSongId + '' );
         const prevPosition: string | undefined = keys[currentPosition - 1];

         if( !prevPosition )  return

         const prevSongId = +prevPosition;

         state.currentSongId = prevSongId;
      },
      updateCurrentVolume: ( state, action: PayloadAction<MusicState['currentVolume']> ) => {
         state.currentVolume = action.payload;
      }
   }
});

export const { updateCurrentSongId, updateFirstSongId, updateIsPlaying, updateCurrentDuration, updateCurrentDurationSeek, updateAllSongs, nextSong, prevSong, updateCurrentVolume } = musicSlice.actions;

const store = configureStore({
   reducer: {
      music: musicSlice.reducer
   }
});

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
