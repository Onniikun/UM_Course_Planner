import React from 'react';
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import AsyncSelect from 'react-select/async';
import './Department.css';

export function Department() {

/**
 * testing data
 */
const options = [
    { value: 'course1', label: 'Course 1' },
    { value: 'course2', label: 'Course 2' },
    { value: 'course3', label: 'Course 3' },
    { value: 'course4', label: 'Course 4' },
    { value: 'course5', label: 'Course 5' },
]

const MyComponent = () => (
  <Select options={options} />
)
const animatedComponents = makeAnimated();
    return (
        <div> 
        <h1>Course Registration</h1>
        <p>Here you can register for your Department/Major</p>
            <div className="courses-container">
                <Select className="custom-select" 
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                options={options} />
                <button className="button">Submit</button>
            </div>
        </div>
    );
}