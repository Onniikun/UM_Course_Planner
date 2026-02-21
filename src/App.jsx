import './App.css'
import { Layout } from './component/layout/layout';
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'
import { Department } from './component/common/course_registration/Department';
import { Contact } from './component/common/contact/contact';
import { loadCourses } from './courseLoader';
import fallCourseList from './fallCourseList.csv?raw';
import winterCourseList from './winterSummerCourseList.csv?raw';
import { main } from './algorithm';
import {filter} from './filterCourses.js';

// console.log(loadCourses(winterCourseList)); // Test course loading
const courseMap = loadCourses(fallCourseList); // Load courses once at the top level
const userCourses = filter(courseMap);
main(userCourses);


function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<h1>Home</h1>} />
        <Route path="/Registration" element={<Department />} />
        <Route path="/Contact" element={<Contact />} />
      </Route>
    </Routes>
  )
}

export default App;
