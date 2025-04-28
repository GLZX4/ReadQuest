export function startBackgroundAnimation() {
    function createQuestionMark() {
        const backgroundContainer = document.querySelector('.background-container');
        if (!backgroundContainer) {
            console.error("Background container not found.");
            return;
        }
    
        const wrapper = document.createElement('div');
        wrapper.classList.add('question-mark-wrapper');
    
        const questionMark = document.createElement('div');
        questionMark.classList.add('question-mark');
        questionMark.textContent = '?';
    
        const size = Math.random() * 80 + 30;
        const left = Math.random() * 100;
        const duration = Math.random() * 10 + 5;
    
        wrapper.style.left = `${left}vw`;
        questionMark.style.fontSize = `${size}px`;
        questionMark.style.animationDuration = `${duration}s`;
    
        wrapper.dataset.spawnX = left;
        wrapper.dataset.depth = Math.random() * 0.5 + 0.5; 
    
        wrapper.appendChild(questionMark);
        backgroundContainer.appendChild(wrapper);
    
        setTimeout(() => {
            wrapper.remove();
        }, duration * 1000);
    }
    
    setInterval(createQuestionMark, 500);

    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (e) => {
        const { innerWidth, innerHeight } = window;
        mouseX = (e.clientX / innerWidth) - 0.5;
        mouseY = (e.clientY / innerHeight) - 0.5;
    });

    // code for parallax effect adapted from: https://www.w3schools.com/howto/howto_css_parallax.asp

    function animateParallax() {
        const wrappers = document.querySelectorAll('.question-mark-wrapper');
        wrappers.forEach(wrapper => {
            const depth = parseFloat(wrapper.dataset.depth || 1);
            const spawnX = parseFloat(wrapper.dataset.spawnX || 50);
    
            const distanceFromCenter = Math.abs(spawnX - 50) / 50; 
    
            const finalDepth = depth * (0.5 + distanceFromCenter * 0.5); 
    
            const offsetX = mouseX * 30 * finalDepth;
            const offsetY = mouseY * 30 * finalDepth;
    
            wrapper.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });
    
        requestAnimationFrame(animateParallax);
    }
    

    requestAnimationFrame(animateParallax);
}