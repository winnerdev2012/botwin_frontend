import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import ProductList from "./components/dashboard/ProductList"
import AddChain from "./components/dashboard/AddChain";
import AddAction from "./components/dashboard/AddAction";
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Users from './components/dashboard/Users';
import Navigation from './components/dashboard/Navigation'

function App() {
  const [msg, setMsg] = useState('')
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/register" element={<Register msg={msg} setMsg={setMsg} />} />
        <Route path="/products" element={<ProductList msg={msg} setMsg={setMsg} />} />
        <Route path="/addaction" element={<AddAction setMsg={setMsg} />} />
        <Route path="/addchain" element={<AddChain setMsg={setMsg} />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </Router>
  );
}

export default App;
