import { useState } from 'react'
import Nav from './Component/Nav/Nav.jsx'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './Pages/Dashboard/Dashboard.jsx';
import Assignment from './Pages/Assignment/Assignment.jsx';
import Performance from './Pages/Performance/Performance.jsx';
import Material from './Pages/Material/Material.jsx';
import Announcement from './Pages/Announcement/Annoucement.jsx';
import StudentProfile from './Pages/Profile/Profile.jsx';
function App() {
  return (
    <>
     <BrowserRouter>
           {/* <Nav /> */}
          <Dashboard/> 
{/* <Assignment /> */}
{/* <Performance /> */}
{/* <Material /> */}
{/* <Announcement /> */}
{/* <StudentProfile/> */}
        </BrowserRouter>
    </>
  )
}

export default App
