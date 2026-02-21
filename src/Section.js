export class Section {
    constructor(CRN, credits, ID, instructor, distanceCourse=false, timeSlot, daysOfWeek=[]) {
        this.CRN = CRN;
        this.credits = credits;
        this.ID = ID;
        this.instructor = instructor;
        this.distanceCourse = distanceCourse;
        this.timeSlot = timeSlot;
        this.daysOfWeek = daysOfWeek;
    }
}