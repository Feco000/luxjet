const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.slide-up').forEach(el => {
    observer.observe(el);
});

const fleet = [
    { id: 'g550', name: 'Gulfstream G550', maxPax: 12, maxHours: 9, pricePerHour: 9500, img: 'Gulfstream-G550.avif' },
    { id: 'g650er', name: 'Gulfstream G650ER', maxPax: 16, maxHours: 17, pricePerHour: 14500, img: 'G650.jpg' },
    { id: 'global7500', name: 'Bombardier Global 7500', maxPax: 18, maxHours: 18, pricePerHour: 12000, img: 'global7500.jpg.webp' }
];

const calcForm = document.getElementById('calcForm');
if (calcForm) {
    calcForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const pax = parseInt(document.getElementById('pax').value);
        const hours = parseFloat(document.getElementById('hours').value);
        const resultsContainer = document.getElementById('calcResults');
        
        resultsContainer.innerHTML = '';
        resultsContainer.classList.remove('hidden');

        if (pax > 18) {
            resultsContainer.innerHTML = '<h2 style="color: #ff4444;">Nincs a flottánkban olyan gép, amely 18 főnél többet tudna szállítani.</h2>';
            return;
        }

        if (hours > 18) {
            resultsContainer.innerHTML = '<h2 style="color: #ff4444;">A maximális repülési idő 18 óra.</h2>';
            return;
        }

        const suitableAircraft = fleet.filter(jet => 
            pax <= jet.maxPax && 
            hours <= jet.maxHours &&
            jet.name !== "Embraer Praetor 500"
        );
        
        if (suitableAircraft.length === 0) {
            resultsContainer.innerHTML = '<h2 style="color: #ff4444;">Nincs a megadott paramétereknek megfelelő repülőgépünk.</h2>';
            return;
        }

        let html = '<h2>Az Ön igényeinek megfelelő gépek</h2><div class="grid" style="margin-top: 30px;">';
        
        suitableAircraft.forEach((jet, index) => {
            const totalCost = (jet.pricePerHour * hours).toLocaleString('hu-HU');
            html += `
                <div class="card slide-up visible" style="transition-delay: ${index * 0.1}s">
                    <div class="img-container">
                        <img src="${jet.img}" alt="${jet.name}">
                    </div>
                    <h3>${jet.name}</h3>
                    <p>Óradíj: ${jet.pricePerHour.toLocaleString('hu-HU')} €</p>
                    <p class="price">Becsült végösszeg: ${totalCost} €</p>
                </div>
            `;
        });
        
        html += '</div>';
        resultsContainer.innerHTML = html;
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}






const cursorPlane = document.getElementById('cursor-plane-container');
const windContainer = document.getElementById('wind-particles-container');

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let lastGenerateTime = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    generateWind(e.movementX, e.movementY);
});

function animateCursor() {
    if (cursorPlane) {
        const delay = 0.15;
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * delay;
        cursorY += dy * delay;

        cursorPlane.style.left = `${cursorX}px`;
        cursorPlane.style.top = `${cursorY}px`;

        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
            const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
            cursorPlane.querySelector('svg').style.transform = `rotate(${angle}deg)`;
        }
    }
    requestAnimationFrame(animateCursor);
}
animateCursor();

function generateWind(movementX, movementY) {
    const now = Date.now();
    if (now - lastGenerateTime < 30) return;

    const speed = Math.abs(movementX) + Math.abs(movementY);
    if (speed < 5) return; 

    lastGenerateTime = now;

    const particle = document.createElement('div');
    particle.classList.add('wind-particle');

    const width = Math.random() * 20 + 10;
    const offsetX = (Math.random() - 0.5) * 20;
    const offsetY = (Math.random() - 0.5) * 20;

    particle.style.width = `${width}px`;
    particle.style.left = `${mouseX + offsetX}px`;
    particle.style.top = `${mouseY + offsetY}px`;

    const angle = Math.atan2(movementY, movementX) * (180 / Math.PI);
    particle.style.transform = `rotate(${angle}deg)`;

    windContainer.appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 600);
}

document.addEventListener('mouseleave', () => {
    if(cursorPlane) cursorPlane.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
    if(cursorPlane) cursorPlane.style.opacity = '1';
});




const scrollPlaneIndicator = document.getElementById('scroll-plane-indicator');
const indicatorPlaneSvg = scrollPlaneIndicator ? scrollPlaneIndicator.querySelector('svg') : null;
let lastScrollYPosition = window.scrollY;

if (scrollPlaneIndicator) {
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;
        
        const scrollPercent = scrollTop / (docHeight - winHeight);
        scrollPlaneIndicator.style.top = `${scrollPercent * 100}%`;

        if (scrollTop > lastScrollYPosition) {
            indicatorPlaneSvg.style.transform = 'rotate(180deg)';
        } else if (scrollTop < lastScrollYPosition) {
            indicatorPlaneSvg.style.transform = 'rotate(0deg)';
        }
        
        lastScrollYPosition = scrollTop;
    });
}