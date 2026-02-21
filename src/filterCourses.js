import userInput from './assets/userInput.json' with { type: "json" };

export function filter(output) {
  if (!userInput) {
    console.error("User input failed to load.");
    return;
  }

  if (!output) {
    console.error("Course data failed to load.");
    return;
  }

  const courses = output // All courses available
  const department = userInput.department; // Department the user wants to take courses in
  const userInputCourses = JSON.parse(JSON.stringify(userInput.courseNumbers)); // Courses the user wants to take

  // Filter courses based on user input
  const filteredCourses = new Array()

  for (const courseName of userInputCourses) {
    const fullCourseName = `${department} ${courseName}`;
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
