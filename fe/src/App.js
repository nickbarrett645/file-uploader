import {Routes, Route} from 'react-router-dom';
import UploadView from './pages/UploadView';
import ListView from './pages/ListView';
import NavBar from './components/NavBar';
import './App.css';

function App() {
  return (
	  <div className="app">
	  	<NavBar/>
		<Routes>
			<Route path="/" element={<UploadView/>}/>
			<Route path="support" element={<ListView/>}/>
		</Routes>
	</div>
  );
}

export default App;
