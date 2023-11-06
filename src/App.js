import './App.css';
import { Header } from './frontend/features/header/Header';
import { Provider } from 'react-redux';
import { store } from "./backend/src/app/store"

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <header >
          < Header />
        </header>
      </div>
    </Provider>
    
  );
}

export default App;
