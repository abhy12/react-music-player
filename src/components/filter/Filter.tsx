import { SyntheticEvent, useCallback } from "react";
import { useAppDispatch, updateFilterCategories } from "../../store/music-store";
import SongSwitcher from "./SongSwitcher";
import CategoryFilter from "./CategoryFilter";
import musicFilterInfo from "../../../util/music-filter-info";
import sfxFilterInfo from "../../../util/sfx-filer-info";
import { useAppSelector } from "../../store/music-store";

interface FilterProps {
   className?: string,
}

export default function Filter( { className }: FilterProps ) {
   const { songType } = useAppSelector( state => state.music );
   const dispatch = useAppDispatch();

   const onChangeHandler = useCallback(( e: SyntheticEvent ) => {
      // @ts-ignore
      if( e.target.nodeName !== 'INPUT' ) return
      const el = e.target as HTMLInputElement;
      dispatch( updateFilterCategories( +el.value ) );
   }, []);

   return (
      <div className={`${className ? className + ' ' : ''}`}>
         <SongSwitcher title={'FILTER BY'} />
         <div onChange={onChangeHandler}>
            { /* @ts-ignore */}
            { songType === 0 && <CategoryFilter categories={musicFilterInfo} /> }
            { /* @ts-ignore */}
            { songType === 1 && <CategoryFilter categories={sfxFilterInfo} /> }
         </div>
      </div>
   )
}
