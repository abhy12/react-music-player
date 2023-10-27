export function convertSecondToMinutesAndSecond( time: number )  {
   const minutes = Math.floor( time / 60 );
   const seconds = Math.floor( time - minutes * 60 );

   return `${minutes}:${seconds}`;
}

export interface FilterInfoType{
   [key: string]: FilterType[]
}

export interface FilterType {
   id: number,
   name: string
}
