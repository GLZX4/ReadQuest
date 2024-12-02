export function startBackgroundAnimation() {
    function createQuestionMark() {
        const backgroundContainer = document.querySelector('.background-container');
        if (!backgroundContainer) {
            console.error("Background container not found.");
            return;
        }

        const questionMark = document.createElement('div');
        questionMark.classList.add('question-mark');
        questionMark.textContent = '?';

        // Randomize size, position, and animation duration
        const size = Math.random() * 80 + 30; // Random size between 10px and 60px
        const left = Math.random() * 100; // Random horizontal position (0% to 100%)
        const duration = Math.random() * 10 + 5; // Random animation duration (5s to 15s)

        questionMark.style.fontSize = `${size}px`;
        questionMark.style.left = `${left}vw`; // Position relative to viewport width
        questionMark.style.animationDuration = `${duration}s`;

        // Append the question mark to the background container
        backgroundContainer.appendChild(questionMark);

        // Remove the question mark after animation ends
        setTimeout(() => {
            questionMark.remove();
        }, duration * 1000);
    }

    setInterval(createQuestionMark, 500); // Create a question mark every 500ms
}
