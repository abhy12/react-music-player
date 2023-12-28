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

class CallStack {
   stack: CallableFunction[] = [];
   isFirstCall: boolean = true;

   constructor() {
      this.stack = [];
   }

   push( callback: Function ) {
      this.stack.push( callback );

      if( this.isFirstCall ) {
         this.isFirstCall = false;
         this.execute();
      }
   }

   execute() {
      if( this.stack.length > 0 ) {
        const callback = this.stack.shift();

        if( typeof callback === "function" ) callback( () => this.execute() ) // Pass a callback to the function to continue the stack
      } else {
        this.isFirstCall = true;
      }
   }

   empty() {
      this.stack = [];
   }
}

export const callStack = new CallStack();
