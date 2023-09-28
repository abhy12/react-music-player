import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

interface MusicState  {
   currentSongId: null | number,
   isPlaying: boolean,
   currentDuration: null | number,
}

const initialState: MusicState = {
   currentSongId: null,
   isPlaying: false,
   currentDuration: null
}

const musicSlice = createSlice({
   name: 'music',
   initialState,
   reducers: {
      updateCurrentSongId: ( state, action: PayloadAction<MusicState['currentSongId']> ) => {
         state.currentSongId = action.payload;
      },
      updateIsPlaying: ( state, action: PayloadAction<MusicState['isPlaying']> ) => {
         state.isPlaying = action.payload;
      },
      updateCurrentDuration: ( state, action: PayloadAction<MusicState['currentDuration']> ) => {
         state.currentDuration = action.payload;
      }
   }
});

export const { updateCurrentSongId, updateIsPlaying, updateCurrentDuration } = musicSlice.actions;

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

