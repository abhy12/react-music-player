import { useState, useEffect, useCallback } from 'react';
import { Provider } from 'react-redux';
import store from './store/music-store';
import Songs from './components/Songs';

function App() {
   return (
      <Provider store={store}>
         <div className="p-3 md:p-5">
            <Songs />
         </div>
      </Provider>
   )
}

export default App
