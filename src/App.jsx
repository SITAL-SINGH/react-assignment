import { useState } from 'react'
import Nav from './Component/Nav/Nav.jsx'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './Pages/Dashboard/Dashboard.jsx';

function App() {
  return (
    <>
     <BrowserRouter>
         
          <Dashboard/> 

        </BrowserRouter>
    </>
  )
}

export default App
