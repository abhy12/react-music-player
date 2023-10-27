import { useState, useCallback } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faXmark } from "@fortawesome/free-solid-svg-icons";
import Modal from './Modal';

interface SongInfoProps {
   songId: number,
}

interface InfoType {
   __html: string
}

export default function SongInfo( { songId }: SongInfoProps ) {
   const [isModalActive, setIsModalActive] = useState( false );
   const [info, setInfo] = useState<null | InfoType>( null );

   const fetchSongInfo = useCallback( async () => {
      if( info )  {
         setIsModalActive( true );
         return
      }

      try{
         const response = await axios.post( "https://staging2.syncorstream.com/api/info_record", {
            id: songId
         });

         const result = response;
         console.log( result );
         setIsModalActive( true );
         if( result?.data?.html )  {
            setInfo( { __html: result.data.html } );
         }
      } catch( e )  {
         console.error( "something went wrong while fetching song info", e );
      }
   }, [info, songId]);

   return (
      <>
         <FontAwesomeIcon
            className="cursor-pointer"
            icon={faInfoCircle}
            onClick={() => fetchSongInfo()}
         />
         {isModalActive &&
            <Modal
               active={isModalActive}
               onClose={() => {
                  setIsModalActive( false );
               }}
            >
               {info &&
                  <div className="m-3 md:m-0 relative">
                     <button
                        className="bg-white text-black w-6 md:w-10 aspect-square rounded-full text-lg md:text-xl flex items-center justify-center absolute right-0 top-0 translate-x-1/2 -translate-y-1/2"
                        onClick={() => setIsModalActive( false )}
                     >
                        <FontAwesomeIcon
                           icon={faXmark}
                        />
                     </button>
                     <ul
                        dangerouslySetInnerHTML={info}
                        className="song-info list-none text-center bg-zinc-700 p-5 md:px-12 md:py-8 rounded space-y-3 md:space-y-5"
                     />
                  </div>
               }
            </Modal>
         }
      </>
   )
}
