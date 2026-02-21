import './App.css'
import { Layout } from './component/layout/layout';
import React from 'react';
import { Routes, Route } from 'react-router-dom'
import { Department } from './component/common/course_registration/Department';
import { Contact } from './component/common/contact/contact';

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<h1>Home</h1>} />
        <Route path="/Registration" element={<Department />} />
        <Route path="/Contact" element={<Contact />} />
      </Route>
    </Routes>
    </>
  )
}


export default App
