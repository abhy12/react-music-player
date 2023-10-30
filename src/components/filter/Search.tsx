import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default function Search() {
   return(
      <div className="relative rounded-full border border-primary-blue overflow-hidden text-lg">
         <input
            className="block font-semibold w-full py-2 pl-4 pr-11 h-11 bg-transparent"
            type="text"
            placeholder="Search"
         />
         <button className="bg-primary-blue text-white absolute right-0 top-0 bottom-0 h-full aspect-square rounded-full">
            <FontAwesomeIcon icon={faChevronRight} />
         </button>
      </div>
   )
}