import { useId, useCallback, ChangeEvent } from "react";
import { updateSongType, useAppDispatch } from "../../store/music-store";

interface SongSwitcherProps {
   title: string,
}

export default function SongSwitcher( { title }: SongSwitcherProps ) {
   const musicBtnId = useId();
   const sfxBtnId = useId();
   const radioId = useId();
   const dispatch = useAppDispatch();

   const changeSongTypeHandler = useCallback(( e: ChangeEvent<HTMLInputElement> ) => {
      const value = +e.currentTarget.value;
      if( value >= 0 ) dispatch( updateSongType( value ) );
   }, []);

   return (
      <div>
         <p className="text-lg font-semibold mb-2 md:mb-3">{title}</p>
         <div className="flex bg-blue-600/20 text-center rounded-full overflow-hidden">
            <div className="flex-1 button-switcher">
               <input
                  className="hidden"
                  id={musicBtnId}
                  type="radio"
                  value="0"
                  name={radioId}
                  onChange={changeSongTypeHandler}
                  defaultChecked={true}
               />
               <label
                  className="block p-2.5 font-semibold cursor-pointer"
                  htmlFor={musicBtnId}
               >MUSIC
               </label>
            </div>
            <div className="flex-1 button-switcher">
               <input
                  className="hidden"
                  id={sfxBtnId}
                  type="radio"
                  value="1"
                  name={radioId}
                  onChange={changeSongTypeHandler}
               />
               <label
                  className="block p-2.5 font-semibold cursor-pointer"
                  htmlFor={sfxBtnId}
               >SFX
               </label>
            </div>
         </div>
      </div>
   )
}
