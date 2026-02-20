class Course {
    constructor(name, spanning=false, requiresLab=false, passFailCourse=false) {
        this.name = name;
        this.spanning = spanning;
        this.requiresLab = requiresLab;
        this.passFailCourse = passFailCourse;
        this.courseSections = [];
        this.labSections = [];
    }

    addCourseSection(section) {
        if (!section) return;
        this.courseSections.push(section);
    }

    addLabSection(section) {
        if (!section) return;
        this.labSections.push(section);
    }
}

module.exports = Course;