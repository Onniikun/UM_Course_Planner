export class Section {
    constructor(name, CRN, credits, ID, instructor, distanceCourse=false, timeSlot, daysOfWeek=[]) {
        this.name = name;
        this.CRN = CRN;
        this.credits = credits;
        this.ID = ID;
        this.instructor = instructor;
        this.distanceCourse = distanceCourse;
        this.timeSlot = timeSlot;
        this.daysOfWeek = daysOfWeek;
    }
}