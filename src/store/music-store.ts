import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { SongInterface } from "../components/Songs";

interface MusicState {
   currentSongId: null | number | string,
   currentSong: SongInterface | null,
   currentAltSongId: null | number | string,
   currentSimSongId: null | number | string,
   firstSongId: number | null,
   isPlaying: boolean,
   isAltPlaying: boolean,
   isSimPlaying: boolean,
   currentDuration: null | number,
   currentDurationSeek: number,
   allSongs: {
      [key: number]: SongInterface
   },
   currentVolume: number,
   songType: number,
   filterCategories: string,
   search: string,
}

const initialState: MusicState = {
   currentSongId: null,
   currentSong: null,
   currentAltSongId: null,
   currentSimSongId: null,
   firstSongId: null,
   isPlaying: false,
   isAltPlaying: false,
   isSimPlaying: false,
   currentDuration: null,
   currentDurationSeek: 0,
   allSongs: {},
   currentVolume: 1,
   songType: 0,
   filterCategories: '',
   search: '',
}

const musicSlice = createSlice({
   name: 'music',
   initialState,
   reducers: {
      updateCurrentSongId: ( state, action: PayloadAction<MusicState['currentSongId']> ) => {
         state.currentSongId = action.payload;
      },
      updateCurrentSong: ( state, action: PayloadAction<MusicState['currentSong']> ) => {
         state.currentSong = action.payload;
      },
      updateCurrentAltSongId: ( state, action: PayloadAction<MusicState['currentAltSongId']> ) => {
         state.currentAltSongId = action.payload;
      },
      updateCurrentSimSongId: ( state, action: PayloadAction<MusicState['currentSimSongId']> ) => {
         state.currentSimSongId = action.payload;
      },
      updateFirstSongId: ( state, action: PayloadAction<MusicState['firstSongId']> ) => {
         state.firstSongId = action.payload;
      },
      updateIsPlaying: ( state, action: PayloadAction<MusicState['isPlaying']> ) => {
         state.isPlaying = action.payload;
      },
      updateIsAltPlaying: ( state, action: PayloadAction<MusicState['isAltPlaying']> ) => {
         state.isAltPlaying = action.payload;
      },
      updateIsSimPlaying: ( state, action: PayloadAction<MusicState['isSimPlaying']> ) => {
         state.isSimPlaying = action.payload;
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
         let globalPosition = state.currentSongId;

         if( typeof globalPosition === "string" ) globalPosition = globalPosition.split( '_' )[0];

         // doing reverse because the way we saving all songs
         const keys = Object.keys( state.allSongs ).reverse();
         const currentPosition = +keys.indexOf( globalPosition + '' );
         const nextPosition: string | undefined = keys[currentPosition + 1];

         if( !nextPosition )  return

         const nextSongId = +nextPosition;

         state.currentSongId = nextSongId;

         // console.log( nextSongId, state.currentSongId, keys );
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
      },
      updateSongType: ( state, action: PayloadAction<MusicState['songType']> ) => {
         state.songType = action.payload;
      },
      updateFilterCategories: ( state, action: PayloadAction<MusicState['filterCategories']> ) => {
         state.filterCategories = action.payload;
      },
      updateSearch: ( state, action: PayloadAction<MusicState['search']> ) => {
         state.search = action.payload;
      }
   }
});

export const {
      updateCurrentSongId, updateCurrentSong, updateFirstSongId, updateIsPlaying, updateCurrentDuration, updateCurrentDurationSeek, updateAllSongs,
      nextSong, prevSong, updateCurrentVolume, updateSongType, updateFilterCategories, updateCurrentAltSongId, updateIsAltPlaying,
      updateCurrentSimSongId, updateIsSimPlaying, updateSearch,
   } = musicSlice.actions;

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
