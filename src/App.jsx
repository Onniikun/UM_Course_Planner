import './App.css'
import { Layout } from './component/layout/layout';
import { Routes, Route } from 'react-router-dom'
import { Department } from './component/common/course_registration/Department';
import { Calender } from '../src/component/common/course_registration/Calender/Calender'
import { Home } from '../src/component/layout/home'
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
        <Route index element={<Home />} />
        <Route path="/Registration" element={<Department />} />
        <Route path="/Registration/Calender" element={<Calender />}/>
        <Route path="/Contact" element={<Contact />} />
      </Route>
    </Routes>
  )
}

export default App;
