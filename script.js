/* ============================================================
   HEART 3D PLACEHOLDER SETUP (Three.js Scene Ready)
   You can later import Gemini's actual heart model here.
============================================================ */

let scene, camera, renderer, heartMesh;

function initHeartModel() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
    camera.position.set(0, 0, 5);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    const container = document.getElementById("heart-3d");
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Placeholder glowing sphere (replace later with Gemini Heart Model)
    const geo = new THREE.SphereGeometry(1.2, 64, 64);
    const mat = new THREE.MeshStandardMaterial({
        color: 0xff2d4d,
        roughness: 0.5,
        metalness: 0.2,
        emissive: 0xff1a3c,
        emissiveIntensity: 0.4
    });
    heartMesh = new THREE.Mesh(geo, mat);

    scene.add(heartMesh);

    const light = new THREE.PointLight(0xff3355, 1.8);
    light.position.set(2, 3, 4);
    scene.add(light);

    animateHeart();
}

function animateHeart() {
    requestAnimationFrame(animateHeart);

    // Heart rotation (subtle)
    heartMesh.rotation.y += 0.003;
    heartMesh.rotation.x += 0.002;

    // Pulse scaling
    const pulse = 1 + Math.sin(Date.now() * 0.005) * 0.04;
    heartMesh.scale.set(pulse, pulse, pulse);

    renderer.render(scene, camera);
}


/* ============================================================
   ECG LIVE WAVE GENERATION
============================================================ */

const ecgPath = document.getElementById("ecg-path");
let ecgPoints = [];

function initECG() {
    for (let i = 0; i < 100; i++) ecgPoints.push(15);
    drawECG();
    setInterval(updateECG, 60);
}

function updateECG() {
    ecgPoints.shift();

    // Generate wave shape
    let value = 15 + Math.sin(Date.now() * 0.015) * 6;

    // Random spike occasionally
    if (Math.random() > 0.94) value -= 10;

    ecgPoints.push(value);
    drawECG();
}

function drawECG() {
    let d = "";
    ecgPoints.forEach((y, i) => {
        d += (i === 0 ? "M" : "L") + i + "," + y;
    });
    ecgPath.setAttribute("d", d);
}


/* ============================================================
   LIVE BPM FLOATING CARD ANIMATION
============================================================ */

function bpmPulseAnimation() {
    const bpmText = document.querySelector(".live-bpm");
    setInterval(() => {
        bpmText.style.transform = "scale(1.05)";
        bpmText.style.transition = "0.25s";
        setTimeout(() => bpmText.style.transform = "scale(1)", 250);
    }, 1000);
}


/* ============================================================
   ORGAN SELECTION LOGIC
============================================================ */

const organItems = document.querySelectorAll(".organ-item");

organItems.forEach((item) => {
    item.addEventListener("click", () => {
        organItems.forEach((o) => o.classList.remove("selected"));
        item.classList.add("selected");
    });
});


/* ============================================================
   STAT CARD ANIMATIONS
============================================================ */

function pulseStatCards() {
    const highlightCard = document.querySelector(".stat-card.highlight");
    setInterval(() => {
        highlightCard.style.transform = "translateY(-3px)";
        highlightCard.style.boxShadow = "0 22px 50px rgba(37, 99, 235, 0.35)";
        setTimeout(() => {
            highlightCard.style.transform = "translateY(0)";
            highlightCard.style.boxShadow = "0 18px 45px rgba(20, 35, 90, 0.45)";
        }, 300);
    }, 1500);
}


/* ============================================================
   INIT EVERYTHING
============================================================ */

window.addEventListener("load", () => {
    // Load Three.js Heart
    initHeartModel();

    // ECG
    initECG();

    // Card Animations
    bpmPulseAnimation();
    pulseStatCards();
});
