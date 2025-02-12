import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './home';
import Groceries from './groceries';
import Login from './login';
import Cart from './cart';
import BuyWindow from './buyWindow';
import Register from './register';

function App() {
  return <BrowserRouter>
  <Routes>
    <Route path='/' element={<Home />}></Route>
    <Route path='/groceries' element={<Groceries />}></Route>
    <Route path='/login' element={<Login />}></Route>
    <Route path='/register' element={<Register />}></Route>
    <Route path='/cart' element={<Cart />}></Route>
    <Route path='/order' element={<BuyWindow />}></Route>
  </Routes>
  </BrowserRouter>
}

export default App;
