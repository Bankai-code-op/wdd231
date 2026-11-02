// Dynamically output the current copyright year in the footer's first paragraph
const currentYearSpan = document.getElementById("currentyear");
if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
}

// Dynamically output the document last modified date in the second paragraph
const lastModifiedElement = document.getElementById("lastModified");
if (lastModifiedElement) {
    lastModifiedElement.innerHTML = `Last Modified: ${document.lastModified}`;
}
