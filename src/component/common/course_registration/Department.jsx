import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import './Department.css';
import logo from '../../../apis/logo-2.png';
import { subjectOptions, courseOptions } from '../../../apis/data.js';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadCourses } from '../../../courseLoader';
import fallCourseList from '../../../fallCourseList.csv?raw';
import winterCourseList from '../../../winterSummerCourseList.csv?raw';
import { main } from '../../../algorithm';
import { filter } from '../../../filterCourses.js';

const courseMap = loadCourses(fallCourseList); // Load courses once at the top level

export function Department() {

  const navigate = useNavigate()
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [optionMajor, setoptionMajor] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState(null);
  // iterates data after every new state.
useEffect(() => {
  if (selectedDepartment) {
    const dept = selectedDepartment.value;

    const major = Array.from(courseMap.entries())
      .filter(([courseName]) => courseName.startsWith(dept))
      .map(([courseName, course]) => ({
        value: courseName,
        label: `${courseName} - ${course.title}`
      }));

    console.log("Dept:", dept);
    console.log("Total courses:", courseMap.size);
    console.log("Filtered courses:", major.length);

    setoptionMajor(major);
    setSelectedMajor(null);
  } else {
    setoptionMajor([]);
  }
}, [selectedDepartment]);

  const handleChange = (option) => {
    setSelectedDepartment(option);
  }

  const handleMajorChange = (option) => {
    setSelectedMajor(option);
  }

  const animatedComponents = makeAnimated();
  return (
    <div>
       <img className="logo" src={logo} alt="University of Manitoba Logo" />
      <h1>Course Registration</h1>
      <p>Here you can register for your Department/Major</p>
      <div className="courses-container">
        {/*Major Selection*/}
        <Select className="custom-select"
          placeholder={"Subject..."}
          closeMenuOnSelect={false}
          components={animatedComponents}
          options={subjectOptions}
          value={selectedDepartment}
          onChange={handleChange}
        />
        {/* Course Selection */}
        <Select className="custom-select"
          placeholder={"Course..."}
          components={animatedComponents}
          options={optionMajor}
          value={selectedMajor}
          onChange={handleMajorChange}
          isDisabled={!selectedDepartment}
          isMulti
        />
        <button className="button"
          onClick={() => {
            if (!selectedDepartment || !selectedMajor) {
              alert("Please select a Major or a Course")
            } else {
              navigate("Calender", {
                state: {
                  selectedDepartment, selectedMajor
                }
              })
            }
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
