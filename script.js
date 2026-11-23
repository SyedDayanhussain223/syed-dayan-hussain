/* =====================================================================
   1. LOADER
   ===================================================================== */
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelector('.loader').classList.add('hidden');
    }, 2200);
});

/* =====================================================================
   2. LENIS SMOOTH SCROLL
   ===================================================================== */
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            lenis.scrollTo(target, { offset: -80 });
        }
    });
});

/* =====================================================================
   3. CUSTOM CURSOR
   ===================================================================== */
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
});

function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('[data-cursor="hover"], a, button').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
});

/* =====================================================================
   4. THREE.JS 3D PLATINUM BACKGROUND
   ===================================================================== */
const canvas = document.getElementById('webgl');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const material = new THREE.MeshStandardMaterial({
    color: 0xC9CCD1,
    metalness: 1,
    roughness: 0.15,
    emissive: 0x7FDBFF,
    emissiveIntensity: 0.05,
});

const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.1, 0.32, 200, 32),
    material
);
knot.position.x = 1.6;
scene.add(knot);

const icos = [];
for (let i = 0; i < 8; i++) {
    const geo = new THREE.IcosahedronGeometry(0.15 + Math.random() * 0.25, 0);
    const mesh = new THREE.Mesh(geo, material.clone());
    mesh.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6 - 2
    );
    icos.push({ mesh, speed: 0.3 + Math.random() * 0.7 });
    scene.add(mesh);
}

const key = new THREE.DirectionalLight(0xffffff, 1.4);
key.position.set(5, 5, 5);
scene.add(key);

const rim = new THREE.DirectionalLight(0x7FDBFF, 1.2);
rim.position.set(-5, -2, 3);
scene.add(rim);

const ambient = new THREE.AmbientLight(0xffffff, 0.15);
scene.add(ambient);

let targetX = 0, targetY = 0;
window.addEventListener('mousemove', e => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 0.6;
    targetY = (e.clientY / window.innerHeight - 0.5) * 0.6;
});

const clock = new THREE.Clock();
function animate3D() {
    const t = clock.getElapsedTime();
    knot.rotation.x = t * 0.15;
    knot.rotation.y = t * 0.22;

    icos.forEach((obj, i) => {
        obj.mesh.rotation.x = t * obj.speed;
        obj.mesh.rotation.y = t * obj.speed * 0.7;
        obj.mesh.position.y += Math.sin(t * 0.5 + i) * 0.002;
    });

    camera.position.x += (targetX * 1.2 - camera.position.x) * 0.04;
    camera.position.y += (-targetY * 1.2 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(animate3D);
}
animate3D();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

/* =====================================================================
   5. GSAP REVEAL ANIMATIONS
   ===================================================================== */
gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll('[data-split]').forEach(el => {
    const text = el.textContent.trim();
    el.innerHTML = '';
    [...text].forEach(ch => {
        const span = document.createElement('span');
        span.className = 'split-char';
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        el.appendChild(span);
    });
});

gsap.to('.hero-title .split-char', {
    y: 0, opacity: 1,
    duration: 1,
    stagger: 0.03,
    ease: 'power4.out',
    delay: 2.4,
});

gsap.utils.toArray('[data-reveal]').forEach(el => {
    gsap.to(el, {
        y: 0, opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
        },
    });
});

gsap.utils.toArray('.section-title[data-split]').forEach(el => {
    gsap.to(el.querySelectorAll('.split-char'), {
        y: 0, opacity: 1,
        duration: 0.9,
        stagger: 0.02,
        ease: 'power4.out',
        scrollTrigger: {
            trigger: el,
            start: 'top 85%',
        },
    });
});

gsap.utils.toArray('.project').forEach((card, i) => {
    gsap.from(card, {
        y: 60, opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: card,
            start: 'top 88%',
        },
        delay: (i % 2) * 0.1,
    });
});

document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'));
    ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () => {
            gsap.to({ val: 0 }, {
                val: target,
                duration: 2,
                ease: 'power2.out',
                onUpdate: function () {
                    el.textContent = Math.floor(this.targets()[0].val);
                },
            });
        },
    });
});

/* =====================================================================
   6. MAGNETIC BUTTONS
   ===================================================================== */
document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(el, { x: x * 0.25, y: y * 0.25, duration: 0.4, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    });
});

/* =====================================================================
   7. 3D TILT PHOTO FRAME
   ===================================================================== */
const frame = document.getElementById('photo-frame');
const stage = document.getElementById('photo-stage');

if (frame && stage) {
    stage.addEventListener('mousemove', e => {
        const rect = stage.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rx = (y / rect.height) * -20;
        const ry = (x / rect.width) * 20;
        frame.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(30px)`;
    });
    stage.addEventListener('mouseleave', () => {
        frame.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';
    });
}

/* =====================================================================
   8. SPOTLIGHT ON PROJECT HOVER
   ===================================================================== */
document.querySelectorAll('.project').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
});