import { Provider } from 'react-redux';
import store from './store/music-store';
import Songs from './components/Songs';

function App() {
   return (
      <Provider store={store}>
         <div >
            <Songs />
         </div>
      </Provider>
   )
}

export default App
