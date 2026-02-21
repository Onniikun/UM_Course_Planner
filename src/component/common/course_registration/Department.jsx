import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import './Department.css';
import { mockOptions, mockMajorOptions } from '../../../apis/mockData';
import React, { useState } from 'react';

export function Department() {

const [selectedDepartment, setSelectedDepartment] = useState(null);
const [optionMajor, setoptionMajor] = useState([]);
const [selectedMajor, setSelectedMajor] = useState(null);
const handleChange = (option) => {
    setSelectedDepartment(option);
}
const major = mockMajorOptions[selectedDepartment?.value] || []; {
    setoptionMajor(major);
}
const animatedComponents = makeAnimated();
    return (
        <div> 
        <h1>Course Registration</h1>
        <p>Here you can register for your Department/Major</p>
            <div className="courses-container">
                <Select className="custom-select" 
                closeMenuOnSelect={false}
                components={animatedComponents}
                options={mockOptions}
                value={selectedOption}
                onChange={handleChange}
                />
                <Select className="custom-select" 
                components={animatedComponents}
                options={optionMajor}
                value={selectedMajor}
                onChange={handleChange}
                />
                <button className="button" onClick={() => alert('Course Registered!')}>
                    Submit</button>
            </div>
        </div>
    );
}