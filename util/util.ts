export function convertSecondToMinutesAndSecond( time: number )  {
   const minutes = Math.floor( time / 60 );
   const seconds = Math.floor( time - minutes * 60 );

   return `${minutes}:${seconds}`;
}

export function debounce( func: CallableFunction, timeout = 200 ) {
   let timer: any;

   return ( ...args: any ) => {
     clearTimeout( timer );

     //  @ts-ignore
     timer = setTimeout(() => { func.apply( this, args ) }, timeout );
   }
 }

export interface FilterInfoType{
   [key: string]: FilterType[]
}

export interface FilterType {
   id: number,
   name: string
}
