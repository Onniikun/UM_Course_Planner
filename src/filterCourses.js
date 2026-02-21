export function filter(output, userInput) {
  // user input is an array of class NAMES e.g. COMP 1010
  console.log("Filtering courses with user input:", userInput);

  if (!userInput) {
    console.error("User input failed to load.");
    return;
  }

  if (!output) {
    console.error("Course data failed to load.");
    return;
  }

  const courses = output // All courses available

  // Filter courses based on user input
  const filteredCourses = new Array()

  for (const course of userInput) {
    const fullCourseName = course.name;
    console.log(`Looking for course: ${fullCourseName}`);
    if (courses.has(fullCourseName)) {
      filteredCourses.push(courses.get(fullCourseName));
    } else {
      console.warn(`Course ${fullCourseName} not found in course data.`);
    }
  }

  console.log("Filtered Courses:", filteredCourses);

  return filteredCourses;
}
