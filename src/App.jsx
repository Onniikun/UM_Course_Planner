import './App.css'
import { Layout } from './component/layout/layout';
import { Routes, Route } from 'react-router-dom'
import { Department } from './component/common/course_registration/Department';
import { Calender } from '../src/component/common/course_registration/Calender/Calender'
import { Home } from '../src/component/layout/home'
import { Contact } from './component/common/contact/contact';

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
