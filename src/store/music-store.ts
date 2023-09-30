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
}

const initialState: MusicState = {
   currentSongId: null,
   firstSongId: null,
   isPlaying: false,
   currentDuration: null,
   currentDurationSeek: 0,
   allSongs: {},
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
      }
   }
});

export const { updateCurrentSongId, updateFirstSongId, updateIsPlaying, updateCurrentDuration, updateCurrentDurationSeek, updateAllSongs } = musicSlice.actions;

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
