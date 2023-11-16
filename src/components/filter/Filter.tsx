import { SyntheticEvent, useCallback, useRef } from "react";
import { useAppDispatch, updateFilterCategories } from "../../store/music-store";
import SongSwitcher from "./SongSwitcher";
import CategoryFilter from "./CategoryFilter";
import musicFilterInfo from "../../../util/music-filter-info";
import sfxFilterInfo from "../../../util/sfx-filer-info";
import { useAppSelector } from "../../store/music-store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Search from "./Search";

interface FilterProps {
   className?: string,
}

export default function Filter( { className }: FilterProps ) {
   const { songType } = useAppSelector( state => state.music );
   const dispatch = useAppDispatch();
   const filterRef = useRef<HTMLDivElement>( null );

   const onChangeHandler = useCallback(( e: SyntheticEvent ) => {
      // @ts-ignore
      if( e.target.nodeName !== 'INPUT' ) return
      const el = e.target as HTMLInputElement;
      dispatch( updateFilterCategories( +el.value ) );
   }, []);

   return (
      <div className={`${className ? className + ' ' : ''}space-y-3`}>
         <div className="flex md:block gap-3">
            <button
               className="md:!hidden py-1 px-3 border border-white/20 rounded shrink-0"
               onClick={() => {
                  if( !filterRef.current ) return

                  filterRef.current.classList.toggle( '!hidden' );
               }}
            >
               <FontAwesomeIcon icon={faBars} />
            </button>
            <Search className="grow" />
         </div>
         <div className="relative">
            <div className="space-y-3 !hidden md:!block absolute md:static -left-3 -right-3 z-50 bg-[#131313] md:bg-transparent p-3 md:p-0" ref={filterRef}>
               <SongSwitcher title={'FILTER BY'} />
               <div onChange={onChangeHandler}>
                  { /* @ts-ignore */}
                  { songType === 0 && <CategoryFilter categories={musicFilterInfo} /> }
                  { /* @ts-ignore */}
                  { songType === 1 && <CategoryFilter categories={sfxFilterInfo} /> }
               </div>
               <button className="bg-primary-blue px-3 md:px-5 py-2 rounded-full font-semibold">UPDATE SEARCH</button>
            </div>
         </div>
      </div>
   )
}
