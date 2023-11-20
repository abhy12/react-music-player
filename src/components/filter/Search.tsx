import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, updateSearch } from "../../store/music-store";
import { debounce } from "../../../util/util";

interface SearchProps{
   className?: string,
}

export default function Search( { className }: SearchProps ) {
   const dispatch = useAppDispatch();
   // @ts-ignore
   const updateSearchTerms = debounce( ( e: Event ) => dispatch( updateSearch( e.target?.value ) ), 500 );

   return(
      <div className={`${className ? className + ' ' : ''}relative rounded-full border border-primary-blue overflow-hidden text-lg`}>
         <input
            className="block font-semibold w-full py-2 pl-4 pr-11 h-11 bg-transparent focus:outline-none"
            type="text"
            placeholder="Search"
            onChange={updateSearchTerms}
         />
         <button className="bg-primary-blue text-white absolute right-0 top-0 bottom-0 h-full aspect-square rounded-full">
            <FontAwesomeIcon icon={faChevronRight} />
         </button>
      </div>
   )
}
