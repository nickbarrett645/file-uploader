import {Routes, Route} from 'react-router-dom';
import UploadView from './pages/UploadView';
import ListView from './pages/ListView';
import './App.css';

function App() {
  return (
	<Routes>
		<Route path="/" element={<UploadView/>}/>
		<Route path="support" element={<ListView/>}/>
	</Routes>
  );
}

export default App;
