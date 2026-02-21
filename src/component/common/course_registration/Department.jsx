import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import './Department.css';
import { subjectOptions, courseOptions } from '../../../apis/data.js';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadCourses } from '../../../courseLoader';
import fallCourseList from '../../../fallCourseList.csv?raw';
import winterCourseList from '../../../winterSummerCourseList.csv?raw';

const courseMap = loadCourses(fallCourseList); // Load courses once at the top level

const selectedCourses = []; // global accumulator

export function Department() {
  const navigate = useNavigate();
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [optionMajor, setOptionMajor] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState([]);

  useEffect(() => {
    if (selectedDepartment) {
      const dept = selectedDepartment.value;
      const major = Array.from(courseMap.entries())
        .filter(([courseName]) => courseName.startsWith(dept))
        .map(([courseName, course]) => ({
          value: courseName,
          label: `${courseName} - ${course.title}`,
        }));

      console.log('Dept:', dept);
      console.log('Total courses:', courseMap.size);
      console.log('Filtered courses:', major.length);

      setOptionMajor(major);
      setSelectedMajor([]);
    } else {
      setOptionMajor([]);
      setSelectedMajor([]);
    }
  }, [selectedDepartment]);

  const handleDepartmentChange = (option) => {
    setSelectedDepartment(option);
  };

  const handleMajorChange = (option) => {
    setSelectedMajor(option || []); // ensure it's always an array
  };

  const animatedComponents = makeAnimated();

  return (
    <div>
      <h1>Course Registration</h1>
      <p>Here you can register for your Department/Major</p>

      <div className="courses-container">
        {/* Department Selection */}
        <Select
          className="custom-select"
          placeholder="Subject..."
          closeMenuOnSelect={false}
          components={animatedComponents}
          options={subjectOptions}
          value={selectedDepartment}
          onChange={handleDepartmentChange}
        />

        {/* Course Selection */}
        <Select
          className="custom-select"
          placeholder="Course..."
          components={animatedComponents}
          options={optionMajor}
          value={selectedMajor}
          onChange={handleMajorChange}
          isDisabled={!selectedDepartment}
          isMulti
        />

        {/* Submit Button */}
        <button className="button" >
          Submit
        </button>
      </div>

      {/* Selected Courses Display */}
      <div className="selected-courses">
        <h2>Selected Courses:</h2>
        <ul>
          {selectedCourses.map((course, index) => (
            <li key={index}>
              {course.name} - {course.title}
            </li>
          ))}
        </ul>

      </div>

      {/* Next Button */}
      <button
        className="button"
        onClick={() => {
          if (!selectedDepartment || selectedMajor.length === 0) {
            alert('Please select a Major or a Course');
          } else {
            // collect course objects
            const coursesToSend = selectedMajor.map(c => courseMap.get(c.value));

            navigate('Calender', {
              state: { courses: coursesToSend }
            });
          }
        }}
      >
        Next
      </button>
    </div>
  );
}
