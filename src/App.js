import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import ProductList from "./components/ProductList"
import AddProduct from "./components/AddProduct";
import Register from './components/Register';
import Login from './components/Login';
import Users from './components/Users';
import DataTables from './components/Datatables';
import Navigation from './components/Navigation'

function App() {
  const [msg, setMsg] = useState('')
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/register" element={<Register msg={msg} setMsg={setMsg} />} />
        <Route path="/products" element={<ProductList msg={msg} setMsg={setMsg} />} />
        <Route path="/add" element={<AddProduct setMsg={setMsg} />} />
        <Route path="/users" element={<Users />} />
        <Route path="/datatables" element={<DataTables />} />
      </Routes>
    </Router>
  );
}

export default App;
