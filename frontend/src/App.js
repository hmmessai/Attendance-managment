import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import SignUp from './Pages/Signup';
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Add from './Pages/Add';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-student" element={<Add/>} />
      </Routes>
    </>
  )
}

export default App;

