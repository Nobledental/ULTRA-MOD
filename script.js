/* ============================================================
   ADVANCED 3D ORGAN ENGINE
   (Merged Gemini Code 1 + Gemini Code 2)
============================================================ */

let scene, camera, renderer, organGroup;
let simplex = new SimplexNoise();

function initHeartModel() {
    const container = document.getElementById("heart-3d");

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 12;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 2.2;

    container.appendChild(renderer.domElement);

    // Medical lighting environment
    const ambient = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
    keyLight.position.set(-5, 5, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x3b82f6, 0.6);
    fillLight.position.set(6, 0, 5);
    scene.add(fillLight);

    const backLight = new THREE.PointLight(0xffffff, 0.8);
    backLight.position.set(0, 5, -10);
    scene.add(backLight);

    // Load default organ
    loadOrgan("heart");

    animateOrganScene();
}


/* ============================================================
   ORGAN LOADER
============================================================ */
function loadOrgan(type) {
    if (organGroup) scene.remove(organGroup);

    organGroup = new THREE.Group();
    organGroup.userData.type = type;

    if (type === "heart") buildHeartModel();
    if (type === "brain") buildBrainModel();
    if (type === "liver") buildLiverModel();
    if (type === "cells") buildCellsModel();

    scene.add(organGroup);
}


/* ============================================================
   GEMINI HEART MODEL — PERFECT REPLICA
============================================================ */
function buildHeartModel() {
    const mat = new THREE.MeshPhysicalMaterial({
        color: 0x880000,
        roughness: 0.45,
        metalness: 0.15,
        clearcoat: 0.9
    });

    const arteryMat = new THREE.MeshPhysicalMaterial({
        color: 0xaa1122,
        roughness: 0.5,
        metalness: 0.05,
        clearcoat: 0.3
    });

    // Left Ventricle
    const lvGeo = new THREE.SphereGeometry(2, 32, 32);
    lvGeo.scale(0.8, 1.25, 0.8);
    const lv = new THREE.Mesh(lvGeo, mat);
    lv.position.set(0.8, -0.4, 0);

    // Right Ventricle
    const rvGeo = new THREE.SphereGeometry(1.8, 32, 32);
    rvGeo.scale(0.9, 1.1, 0.75);
    const rv = new THREE.Mesh(rvGeo, mat);
    rv.position.set(-0.75, 0, 0.4);

    // Left Atrium
    const laGeo = new THREE.SphereGeometry(1.3, 28, 28);
    const la = new THREE.Mesh(laGeo, mat);
    la.position.set(1.0, 1.4, -0.5);

    // Right Atrium
    const raGeo = new THREE.SphereGeometry(1.4, 24, 24);
    const ra = new THREE.Mesh(raGeo, mat);
    ra.position.set(-1.2, 1.2, 0);

    // Aorta
    const aortaGeo = new THREE.TorusGeometry(1.5, 0.55, 16, 32, 2.6);
    const aorta = new THREE.Mesh(aortaGeo, arteryMat);
    aorta.position.set(0.5, 2.4, 0);
    aorta.rotation.z = 2.5;
    aorta.rotation.y = 0.6;

    organGroup.add(lv, rv, la, ra, aorta);
}


/* ============================================================
   BRAIN MODEL — HIGH DETAIL NOISE-DEFORMED 3D
============================================================ */
function buildBrainModel() {
    const brainMat = new THREE.MeshPhysicalMaterial({
        color: 0xffbbbb,
        roughness: 0.6,
        clearcoat: 0.3,
        flatShading: true
    });

    const geo = new THREE.IcosahedronGeometry(2.4, 5);
    const pos = geo.attributes.position;

    // Apply noise deformation
    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);
        const noise = simplex.noise3D(x * 1.2, y * 1.2, z * 1.2);
        pos.setXYZ(i, x * (1 + noise * 0.12), y * (1 + noise * 0.12), z * (1 + noise * 0.12));
    }
    geo.computeVertexNormals();

    const leftBrain = new THREE.Mesh(geo, brainMat);
    leftBrain.position.x = -1.1;

    const rightBrain = new THREE.Mesh(geo, brainMat);
    rightBrain.position.x = 1.1;
    rightBrain.rotation.y = Math.PI;

    // Synaptic wireframe overlay
    const wireGeo = new THREE.WireframeGeometry(geo);
    const wireMat = new THREE.LineBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.14
    });

    const leftWire = new THREE.LineSegments(wireGeo, wireMat);
    leftWire.position.x = -1.1;

    const rightWire = new THREE.LineSegments(wireGeo, wireMat);
    rightWire.position.x = 1.1;
    rightWire.rotation.y = Math.PI;

    organGroup.add(leftBrain, rightBrain, leftWire, rightWire);
}


/* ============================================================
   LIVER MODEL — SMOOTH ORGANIC FORM
============================================================ */
function buildLiverModel() {
    const mat = new THREE.MeshPhysicalMaterial({
        color: 0x5a2a2a,
        roughness: 0.35,
        clearcoat: 0.5
    });

    // Right lobe
    const rGeo = new THREE.SphereGeometry(2.4, 48, 48);
    rGeo.scale(1.2, 0.8, 0.8);
    const r = new THREE.Mesh(rGeo, mat);
    r.position.set(0.6, 0, 0);

    // Left lobe
    const lGeo = new THREE.ConeGeometry(2, 4, 32);
    lGeo.scale(0.8, 0.4, 0.8);
    const l = new THREE.Mesh(lGeo, mat);
    l.position.set(-1.7, 0.6, 0.2);
    l.rotation.z = 1.4;

    organGroup.add(r, l);
}


/* ============================================================
   CELLS MODEL — RBC + WBC CLUSTER
============================================================ */
function buildCellsModel() {
    const rbcMat = new THREE.MeshPhysicalMaterial({ color: 0xaa0000, roughness: 0.5, clearcoat: 0.2 });
    const wbcMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 1.0 });

    const rbcGeo = new THREE.TorusGeometry(0.55, 0.22, 16, 32);
    const wbcGeo = new THREE.IcosahedronGeometry(0.8, 1);

    for (let i = 0; i < 15; i++) {
        const isWBC = i > 12;
        const mesh = new THREE.Mesh(isWBC ? wbcGeo : rbcGeo, isWBC ? wbcMat : rbcMat);

        mesh.position.set(
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 4
        );

        mesh.rotation.set(
            Math.random() * 3,
            Math.random() * 3,
            Math.random() * 3
        );

        organGroup.add(mesh);
    }
}


/* ============================================================
   ANIMATION LOOP
============================================================ */
function animateOrganScene() {
    requestAnimationFrame(animateOrganScene);

    if (organGroup) {
        const t = Date.now() * 0.002;

        organGroup.rotation.y += 0.002;

        if (organGroup.userData.type === "heart") {
            const pulse = 1 + Math.sin(Date.now() * 0.008) * 0.06;
            organGroup.scale.set(pulse, pulse, pulse);
        }

        if (organGroup.userData.type === "cells") {
            organGroup.children.forEach((c, i) => {
                c.position.y += Math.sin(t + i) * 0.002;
                c.rotation.x += 0.01;
            });
        }
    }

    renderer.render(scene, camera);
}

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
