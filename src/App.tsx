import { Provider } from 'react-redux';
import store from './store/music-store';
import Songs from './components/Songs';
import Player from './components/Player';
import Filter from './components/filter/Filter';

function App() {
   return (
      <Provider store={store}>
         <div className="min-h-screen p-3 md:p-5 flex flex-col md:flex-row md:items-start gap-6">
            <Filter className="md:w-1/6 md:sticky md:top-0"/>
            <Songs className="md:w-5/6"/>
         </div>
         <Player />
      </Provider>
   )
}

export default App
