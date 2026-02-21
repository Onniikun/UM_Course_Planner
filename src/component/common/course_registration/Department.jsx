import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import './Department.css';
import logo from '../../../apis/logo-2.png';
import { subjectOptions, courseOptions } from '../../../apis/data.js';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadCourses } from '../../../courseLoader';
import fallCourseList from '../../../fallCourseList.csv?raw';

const courseMap = loadCourses(fallCourseList); // Load once

export function Department() {
  const navigate = useNavigate();
  const animatedComponents = makeAnimated();

  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [optionMajor, setOptionMajor] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [isMWF, setIsMWF] = useState(false);
  const [isTT, setIsTT] = useState(false);
  const [earliestTime, setEarliestTime] = useState('');
  const [latestTime, setLatestTime] = useState('');

  useEffect(() => {
    if (selectedDepartment) {
      const dept = selectedDepartment.value;

      const major = Array.from(courseMap.entries())
        .filter(([courseName]) => courseName.startsWith(dept))
        .map(([courseName, course]) => ({
          value: courseName,
          label: `${courseName} - ${course.title}`,
        }));

      setOptionMajor(major);
      setSelectedMajor([]); // reset course picker only (not submitted courses)
    } else {
      setOptionMajor([]);
      setSelectedMajor([]);
    }
  }, [selectedDepartment]);

  const handleDepartmentChange = (option) => {
    setSelectedDepartment(option);
    setSubmitted(false); // reset visual state when changing dept
  };

  const handleMajorChange = (option) => {
    setSelectedMajor(option || []);
    setSubmitted(false);
  };

  const handleSubmit = () => {
    if (selectedMajor.length === 0) return;

    const newCourses = selectedMajor
      .map(c => courseMap.get(c.value))
      .filter(Boolean);

    // Prevent duplicates
    setSelectedCourses(prev => {
      const existing = new Set(prev.map(c => c.name));
      const merged = [
        ...prev,
        ...newCourses.filter(c => !existing.has(c.name))
      ];
      return merged;
    });

    setSubmitted(true); // visual feedback
    setSelectedMajor([]);
  };

  return (
    <div>
       <img className="logo" src={logo} alt="University of Manitoba Logo" />
      <h1>Course Registration</h1>
      <p>Here you can register for your Department/Major</p>

      <ul>
        <input
          type="checkbox"
          id="isMWF"
          checked={isMWF}
          onChange={(e) => setIsMWF(e.target.checked)}
        />
        <label htmlFor="isMWF">MWF Classes</label>

        <input
          type="checkbox"
          id="isTT"
          checked={isTT}
          onChange={(e) => setIsTT(e.target.checked)}
        />
        <label htmlFor="isTT">TT Classes</label>

        <li>
          <label htmlFor="earliest">Earliest Time (Minutes since 12 am):</label>
          <input
            type="number"
            id="earliest"
            value={earliestTime}
            onChange={(e) => setEarliestTime(e.target.value)}
          />
        </li>

        <li>
          <label htmlFor="latest">Latest Time (Minutes since 12 am):</label>
          <input
            type="number"
            id="latest"
            value={latestTime}
            onChange={(e) => setLatestTime(e.target.value)}
          />
        </li>
      </ul>

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

        {/* Submit Button with Visual Feedback */}
        <button
          className={`button ${submitted ? 'submitted' : ''}`}
          onClick={handleSubmit}
          disabled={selectedMajor.length === 0}
        >
          {submitted ? 'Added ✓' : 'Add Courses'}
        </button>
      </div>

      {/* Selected Courses Display (persistent) */}
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

      {/* Next Button now uses ALL submitted courses */}
      <button
        className="button"
        onClick={() => {
          if (selectedCourses.length === 0) {
            alert('Please submit at least one course');
          } else {
            navigate('Calender', {
              state: {
                courses: selectedCourses,
                constraints: {
                  isMWF,
                  isTT,
                  earliestTime: Number(earliestTime),
                  latestTime: Number(latestTime),
                }
              }
            });
          }
        }}
      >
        Next
      </button>
    </div>
  );
}
