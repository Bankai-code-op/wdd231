// Course List Array from BYU-Idaho Web and Computer Programming Certificate
const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
        technology: [
            'Python'
        ],
        completed: true
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually participating in simple web designs and programming. It is anticipated that students who complete this course will understand the fields of web design and development and will have a good idea if they want to pursue this degree as a major.',
        technology: [
            'HTML',
            'CSS'
        ],
        completed: true
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call , debug, and test their own functions; and to handle errors within functions. CSE 111 students write programs with functions to solve problems in many disciplines, including business, physical science, human performance, and humanities.',
        technology: [
            'Python'
        ],
        completed: true
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.',
        technology: [
            'C#'
        ],
        completed: false
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.',
        technology: [
            'HTML',
            'CSS',
            'JavaScript'
        ],
        completed: true
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.',
        technology: [
            'HTML',
            'CSS',
            'JavaScript'
        ],
        completed: false
    }
];

// DOM Selectors
const coursesContainer = document.getElementById("courses-container");
const creditCountSpan = document.getElementById("credit-count");
const allBtn = document.getElementById("all-courses");
const cseBtn = document.getElementById("cse-courses");
const wddBtn = document.getElementById("wdd-courses");

/**
 * Dynamically displays the courses in the certificate section
 * @param {Array} filteredCourses - Array of course objects to render
 */
function displayCourses(filteredCourses) {
    if (!coursesContainer) return;
    coursesContainer.innerHTML = "";

    filteredCourses.forEach(course => {
        const card = document.createElement("div");
        card.className = `course-card ${course.completed ? "completed" : "incomplete"}`;

        card.innerHTML = `
            <h3>
                <span>${course.subject} ${course.number}</span>
                <span class="status-badge">${course.completed ? "✓ Done" : "In Progress"}</span>
            </h3>
            <p class="course-name">${course.title}</p>
            <span class="course-credits">${course.credits} Credits</span>
        `;

        coursesContainer.appendChild(card);
    });

    // Dynamically calculate credits using reduce()
    const totalCredits = filteredCourses.reduce((accumulator, course) => accumulator + course.credits, 0);
    if (creditCountSpan) {
        creditCountSpan.textContent = totalCredits;
    }
}

/**
 * Updates active styling on filter buttons
 * @param {HTMLButtonElement} activeButton
 */
function setActiveButton(activeButton) {
    [allBtn, cseBtn, wddBtn].forEach(btn => btn?.classList.remove("active"));
    activeButton?.classList.add("active");
}

// Event Listeners for UI Filtering
if (allBtn && cseBtn && wddBtn) {
    allBtn.addEventListener("click", () => {
        setActiveButton(allBtn);
        displayCourses(courses);
    });

    cseBtn.addEventListener("click", () => {
        setActiveButton(cseBtn);
        const cseCourses = courses.filter(course => course.subject === "CSE");
        displayCourses(cseCourses);
    });

    wddBtn.addEventListener("click", () => {
        setActiveButton(wddBtn);
        const wddCourses = courses.filter(course => course.subject === "WDD");
        displayCourses(wddCourses);
    });
}

displayCourses(courses);