'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');

// Modal window
const openModal = function(e) {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');

    e.preventDefault();
};

const closeModal = function() {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
    btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

//IMPLMENT SMOOTH SCROLLING
btnScrollTo.addEventListener('click', e => {
    //Scrolling
    //Get coordinate of where we are scrolling to
    // const s1coords = section1.getBoundingClientRect();
    // window.scrollTo({
    //     left: s1coords.left + window.pageXOffset,
    //     top: s1coords.top + window.pageYOffset,
    //     behavior: 'smooth',
    // });

    //Only works in mordern browsers
    section1.scrollIntoView({ behavior: 'smooth' });

    e.preventDefault();
});

//Page Navigation
// document.querySelectorAll('.nav__link').forEach(el => {
//     el.addEventListener('click', function(e) {
//         const id = this.getAttribute('href');
//         document.querySelector(id).scrollIntoView({ behavior: 'smooth' });

//         e.preventDefault();
//     });
// });

//Alternative of page navigation using event delegation
document.querySelector('.nav__links').addEventListener('click', e => {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    e.preventDefault();
});

//Building the tabbed component
tabsContainer.addEventListener('click', e => {
    const clicked = e.target.closest('.operations__tab');
    if (clicked) {
        tabs.forEach(t => t.classList.remove('operations__tab--active'));

        clicked.classList.add('operations__tab--active');

        tabsContent.forEach(c => c.classList.remove('operations__content--active'));

        document
            .querySelector(`.operations__content--${clicked.dataset.tab}`)
            .classList.add('operations__content--active');
    }
    e.preventDefault();
});

//Menu fade animation
const handleHover = (e, opacity) => {
    if (e.target.classList.contains('nav__link')) {
        const link = e.target;
        const siblings = link.closest('.nav').querySelectorAll('.nav__link');

        const logo = link.closest('.nav').querySelector('img');

        siblings.forEach(el => {
            if (el !== link) el.style.opacity = opacity;
        });
        logo.style.opacity = opacity;
    }
};
nav.addEventListener('mouseover', e => {
    handleHover(e, 0.5);
});

nav.addEventListener('mouseout', e => {
    handleHover(e, 1);
});

//Sticky navigation
//Poor performance
// const initialCoordinates = section1.getBoundingClientRect();
// window.addEventListener('scroll', () => {
//     console.log(window.scrollY);

//     window.scrollY > initialCoordinates.top ?
//         nav.classList.add('sticky') :
//         nav.classList.remove('sticky');
// });

//Sticky navigation using the Intersection Observer API
// const observerCallback = (entries, observer) => {
//     entries.forEach(entry => console.log(entry));
// };
// const observerOptions = {
//     root: null,
//     threshold: [0, 0.2],
// };
// const observer = new IntersectionObserver(observerCallback, observerOptions);
// observer.observe(section1);

const navHeight = nav.getBoundingClientRect().height;
const stickyNav = entries => {
    const [entry] = entries;

    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//Reaveal Sections
const revealSection = function(entries, observer) {
    const [entry] = entries;
};
const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
});

allSections.forEach(section => {
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
});

//Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');
console.log(imgTargets);

const loadImg = function(entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    //replace src attribute with data-src
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load', function() {
        entry.target.classList.remove('lazy-img');
    });

    observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
    rootMargin: '+200px',
});

imgTargets.forEach(el => imgObserver.observe(el));

//Slider
slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i})`));

slider.style.transform = `scale(0.5)`;
slider.style.overflow = 'visible';