import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import './Department.css';
import { mockOptions, mockMajorOptions } from '../../../apis/mockData';
import { useState, useEffect } from 'react';
import { useNavigate  } from 'react-router-dom';

export function Department() {

const navigate = useNavigate()

const [selectedDepartment, setSelectedDepartment] = useState(null);
const [optionMajor, setoptionMajor] = useState([]);
const [selectedMajor, setSelectedMajor] = useState(null);
    // iterates data after every new state.
    useEffect(() => {
        if (selectedDepartment) {
            const major = mockMajorOptions[selectedDepartment.value] || [];
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
        <h1>Course Registration</h1>
        <p>Here you can register for your Department/Major</p>
            <div className="courses-container">
                {/*Major Selection*/}
                <Select className="custom-select" 
                placeholder={"Major..."}
                closeMenuOnSelect={false}
                components={animatedComponents}
                options={mockOptions}
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
                    if(!selectedDepartment || !selectedMajor) {
                        alert("Please select a Major or a Course")
                    } else {
                        navigate("Calender", {
                            state: {
                                selectedDepartment, selectedMajor
                            }
                        })
                    }}}
                    >
                    Submit
                    </button>
            </div>
        </div>
    );
}