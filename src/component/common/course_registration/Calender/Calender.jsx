import { useLocation } from "react-router-dom"

export function Calender() {
    const location = useLocation()
    const { selectedDepartment, selectedMajor } = location.state || {};
    return(
        <>
        <div>
            <h3>
                Your classes
            </h3>
            <p>
                Department: {selectedDepartment ? selectedDepartment.label: "None"}
            </p>
            <p>
                {/* 
                Iteration conndition if its null
                Then loops throught json data.
                */}
                Major: {selectedMajor && selectedMajor.length > 0 ? 
                selectedMajor.map(m => m.label).join(", ")
                : "None"}
            </p>
        </div>
        </>
    )
}