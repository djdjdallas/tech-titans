import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ==========================================
// 1. DATA CONFIGURATION
// ==========================================

const CHARACTERS = [
    {
        id: "oracle",
        name: "THE ORACLE",
        realName: "Sam Altman",
        company: "OpenAI",
        class: "SUMMONER",
        modelPath: "./models/oracle-altman.glb",
        themeColor: "#4A9EFF",
        stats: { HP: 900, ATK: 750, DEF: 600, SPD: 500, INT: 1000 },
        skills: [{ name: "GPT Burst", desc: "Rapid-fire knowledge beam", icon: "⚡" }, { name: "Alignment Field", desc: "Slows enemies in radius", icon: "🛡️" }],
        ultimate: { name: "AGI ASCENSION", desc: "All stats doubled for 10s" },
        quote: "The future belongs to those who build it."
    },
    {
        id: "disruptor",
        name: "THE DISRUPTOR",
        realName: "Elon Musk",
        company: "xAI / Tesla / SpaceX",
        class: "BERSERKER",
        modelPath: "./models/disruptor-musk.glb",
        themeColor: "#FF3333",
        stats: { HP: 1100, ATK: 950, DEF: 500, SPD: 800, INT: 700 },
        skills: [{ name: "Rocket Punch", desc: "Massive single-target hit", icon: "🚀" }, { name: "Tweet Storm", desc: "AOE — confuses allies too", icon: "🌪️" }],
        ultimate: { name: "FULL SELF DRIVING", desc: "Autonomous attacks for 8s" },
        quote: "When something is important enough, you do it."
    },
    {
        id: "guardian",
        name: "THE GUARDIAN",
        realName: "Dario Amodei",
        company: "Anthropic",
        class: "PALADIN",
        modelPath: "./models/guardian-amodei.glb",
        themeColor: "#FFB800",
        stats: { HP: 1200, ATK: 600, DEF: 1000, SPD: 450, INT: 900 },
        skills: [{ name: "Constitutional Shield", desc: "Blocks incoming damage", icon: "🛡️" }, { name: "Safety Pulse", desc: "Heals + cleanses team", icon: "✨" }],
        ultimate: { name: "RESPONSIBLE SCALING", desc: "Invulnerable, reflects dmg 12s" },
        quote: "Safety through strength."
    },
    {
        id: "architect",
        name: "THE ARCHITECT",
        realName: "Jensen Huang",
        company: "NVIDIA",
        class: "ENGINEER",
        modelPath: "./models/architect-huang.glb",
        themeColor: "#76B900",
        stats: { HP: 950, ATK: 850, DEF: 700, SPD: 600, INT: 950 },
        skills: [{ name: "CUDA Cores", desc: "Multi-hit parallel attack", icon: "⚙️" }, { name: "Leather Jacket Shield", desc: "Armor buff + style points", icon: "🧥" }],
        ultimate: { name: "GPU SINGULARITY", desc: "Overclocks reality, slows enemies" },
        quote: "The more you buy, the more you save."
    },
    {
        id: "worldbuilder",
        name: "WORLD BUILDER",
        realName: "Mark Zuckerberg",
        company: "Meta",
        class: "ILLUSIONIST",
        modelPath: "./models/worldbuilder-zuck.glb",
        themeColor: "#0866FF",
        stats: { HP: 1000, ATK: 700, DEF: 650, SPD: 900, INT: 800 },
        skills: [{ name: "Reality Shift", desc: "Teleport behind enemy", icon: "🌀" }, { name: "Data Harvest", desc: "Steal enemy buffs", icon: "📊" }],
        ultimate: { name: "METAVERSE COLLAPSE", desc: "Traps enemies in VR prison" },
        quote: "Move fast and break things."
    },
    {
        id: "overseer",
        name: "THE OVERSEER",
        realName: "Sundar Pichai",
        company: "Google / Alphabet",
        class: "CONTROLLER",
        modelPath: "./models/overseer-pichai.glb",
        themeColor: "#34A853",
        stats: { HP: 1000, ATK: 700, DEF: 750, SPD: 550, INT: 1000 },
        skills: [{ name: "Search & Destroy", desc: "Homing projectile, never misses", icon: "🔍" }, { name: "DeepMind Link", desc: "Predicts next 3 enemy moves", icon: "🧠" }],
        ultimate: { name: "GOOGLE CLOUD", desc: "Rains data beams from above" },
        quote: "Focus on the user and all else will follow."
    }
];

// ==========================================
// 2. THREE.JS SETUP
// ==========================================

// Ensure DOM is ready before initializing
function init() {
    const container = document.getElementById('canvas-container');
    if (!container) {
        console.error("Canvas container not found!");
        return;
    }

    const scene = new THREE.Scene();

    // Fog for depth blending
    scene.fog = new THREE.FogExp2(0x08080c, 0.02);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 1.5, 4.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Perf optimization
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.minDistance = 2.5;
    controls.maxDistance = 7;
    // Limit vertical angle to keep floor visible
    controls.maxPolarAngle = Math.PI / 2 - 0.1;

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Key Light (Main form)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(-2, 4, 3);
    scene.add(keyLight);

    // Rim Light (Backlight for silhouette)
    const rimLight = new THREE.SpotLight(0xffffff, 4.0);
    rimLight.position.set(0, 3, -4);
    rimLight.lookAt(0, 0, 0);
    scene.add(rimLight);

    // Accent Light (Colored based on character)
    const accentLight = new THREE.PointLight(0x4A9EFF, 5.0, 10);
    accentLight.position.set(2, 2, 2);
    scene.add(accentLight);

    // --- Platform ---
    const platformGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.1, 64);
    const platformMat = new THREE.MeshStandardMaterial({ 
        color: 0x111111, 
        metalness: 0.8, 
        roughness: 0.2 
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = -0.05;
    scene.add(platform);

    // Glowing Ring
    const ringGeo = new THREE.TorusGeometry(1.2, 0.02, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x4A9EFF });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0;
    scene.add(ring);

    // --- Particles System ---
    const particleCount = 100;
    const particlesGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);

    for(let i=0; i<particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 3; // Spread
    }

    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
        size: 0.03,
        color: 0x4A9EFF,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlesMesh);

    // ==========================================
    // 3. MODEL LOADING & LOGIC
    // ==========================================

    let currentModel = null;
    let mixer = null;
    let currentIdx = 0;
    const loader = new GLTFLoader();
    const loadingIndicator = document.getElementById('loading-indicator');
    const clock = new THREE.Clock();

    // Fallback generator if model fails
    function createPlaceholder(color) {
        const group = new THREE.Group();
        const mat = new THREE.MeshStandardMaterial({ 
            color: color, 
            wireframe: true, 
            emissive: color,
            emissiveIntensity: 0.5
        });

        // Head
        const head = new THREE.Mesh(new THREE.IcosahedronGeometry(0.15, 1), mat);
        head.position.y = 1.6;
        group.add(head);

        // Body
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.2, 0.7, 8), mat);
        body.position.y = 1.1;
        group.add(body);

        // Shoulders
        const shoulders = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.1, 0.2), mat);
        shoulders.position.y = 1.4;
        group.add(shoulders);

        return group;
    }

    async function loadCharacter(index) {
        const charData = CHARACTERS[index];
        
        // 1. Show loading UI
        if(loadingIndicator) {
            loadingIndicator.style.display = 'block';
            loadingIndicator.innerText = `INITIALIZING ${charData.name}...`;
        }

        // 2. Fade out existing model
        if (currentModel) {
            scene.remove(currentModel);
            currentModel.traverse((child) => {
                if (child.isMesh) {
                    child.geometry.dispose();
                    if (child.material.map) child.material.map.dispose();
                    child.material.dispose();
                }
            });
            currentModel = null;
            mixer = null;
        }

        // 3. Update Scene Lighting Colors
        const colorHex = new THREE.Color(charData.themeColor);
        accentLight.color.set(colorHex);
        ring.material.color.set(colorHex);
        particlesMat.color.set(colorHex);

        // 4. Update UI DOM
        updateUI(index);

        // 5. Load GLB
        try {
            const gltf = await new Promise<any>((resolve, reject) => {
                loader.load(
                    charData.modelPath,
                    (data) => resolve(data),
                    (xhr) => {
                        // Progress callback
                        if (loadingIndicator && xhr.total > 0) {
                            const percent = Math.round((xhr.loaded / xhr.total) * 100);
                            loadingIndicator.innerText = `LOADING ${charData.name} - ${percent}%`;
                        }
                    },
                    (err) => reject(err)
                );
            });

            currentModel = gltf.scene;
            
            // Animation Setup
            if (gltf.animations && gltf.animations.length > 0) {
                mixer = new THREE.AnimationMixer(currentModel);
                const action = mixer.clipAction(gltf.animations[0]);
                action.play();
            }

            // Normalization (Scale/Center)
            const box = new THREE.Box3().setFromObject(currentModel);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            
            // Scale to roughly 1.8 units high
            const scaleFactor = 1.8 / size.y;
            currentModel.scale.setScalar(scaleFactor);
            
            // Recenter after scale
            currentModel.position.x = -center.x * scaleFactor;
            currentModel.position.y = 0; // On floor
            currentModel.position.z = -center.z * scaleFactor;

            scene.add(currentModel);

        } catch (error) {
            console.warn(`Failed to load ${charData.modelPath}. Using placeholder.`);
            // Generate placeholder
            currentModel = createPlaceholder(charData.themeColor);
            scene.add(currentModel);
        }

        if(loadingIndicator) loadingIndicator.style.display = 'none';
    }

    // ==========================================
    // 4. UI LOGIC
    // ==========================================

    function updateUI(index) {
        const data = CHARACTERS[index];
        const root = document.documentElement;

        // Update CSS Variables for color theme
        root.style.setProperty('--theme-color', data.themeColor);
        
        // Helper to compute RGB for rgba usage
        const hex = data.themeColor.replace('#', '');
        const r = parseInt(hex.substring(0,2), 16);
        const g = parseInt(hex.substring(2,4), 16);
        const b = parseInt(hex.substring(4,6), 16);
        root.style.setProperty('--theme-rgb', `${r}, ${g}, ${b}`);

        // Text Updates
        const safeSetText = (id, text) => {
            const el = document.getElementById(id);
            if(el) el.innerText = text;
        }

        safeSetText('char-name', data.name);
        safeSetText('char-realname', data.realName);
        safeSetText('char-company', data.company);
        safeSetText('char-class', data.class);
        safeSetText('char-quote', `"${data.quote}"`);

        // Skills
        const skillsContainer = document.getElementById('skills-container');
        if (skillsContainer) {
            skillsContainer.innerHTML = '';
            data.skills.forEach(skill => {
                const div = document.createElement('div');
                div.className = 'skill-card';
                div.innerHTML = `
                    <div class="skill-header">
                        <span class="skill-icon">${skill.icon}</span>
                        <span class="skill-name">${skill.name}</span>
                    </div>
                    <div class="skill-desc">${skill.desc}</div>
                `;
                skillsContainer.appendChild(div);
            });
        }

        // Ultimate
        safeSetText('ult-name', data.ultimate.name);
        safeSetText('ult-desc', data.ultimate.desc);

        // Stats
        const statsContainer = document.getElementById('stats-container');
        let totalPower = 0;

        if (statsContainer) {
            statsContainer.innerHTML = '';
            for (const [key, value] of Object.entries(data.stats)) {
                totalPower += value;
                const percent = Math.min((value / 1200) * 100, 100);
                
                const row = document.createElement('div');
                row.className = 'stat-row';
                row.innerHTML = `
                    <div class="stat-label">${key}</div>
                    <div class="stat-bar-container">
                        <div class="stat-bar-fill" style="width: 0%"></div>
                    </div>
                    <div class="stat-value">${value}</div>
                `;
                statsContainer.appendChild(row);

                setTimeout(() => {
                    const fill = row.querySelector('.stat-bar-fill') as HTMLElement;
                    if(fill) fill.style.width = `${percent}%`;
                }, 50);
            }
        }

        // Power Animation
        const powerEl = document.getElementById('total-power');
        if (powerEl) {
            let currentDisplay = 0;
            const animatePower = () => {
                if(currentDisplay < totalPower) {
                    currentDisplay += 20;
                    if(currentDisplay > totalPower) currentDisplay = totalPower;
                    powerEl.innerText = currentDisplay.toString();
                    requestAnimationFrame(animatePower);
                }
            };
            animatePower();
        }

        // Trigger Animation Re-flows for panels
        const leftPanel = document.getElementById('panel-left');
        const rightPanel = document.getElementById('panel-right');
        
        if (leftPanel) {
            leftPanel.classList.remove('animate-in-left');
            void leftPanel.offsetWidth; // trigger reflow
            leftPanel.classList.add('animate-in-left');
        }

        if (rightPanel) {
            rightPanel.classList.remove('animate-in-right');
            void rightPanel.offsetWidth;
            rightPanel.classList.add('animate-in-right');
        }

        // Update Roster Highlight
        document.querySelectorAll('.roster-item').forEach((item, idx) => {
            if (idx === index) item.classList.add('active');
            else item.classList.remove('active');
        });
    }

    function createRoster() {
        const rosterContainer = document.getElementById('roster-container');
        if (!rosterContainer) return;
        
        rosterContainer.innerHTML = '';
        CHARACTERS.forEach((char, index) => {
            const btn = document.createElement('div');
            btn.className = 'roster-item';
            btn.innerText = char.realName.split(' ')[1].substring(0, 3).toUpperCase();
            btn.style.borderColor = char.themeColor;
            
            btn.onclick = () => {
                if (currentIdx !== index) {
                    currentIdx = index;
                    loadCharacter(currentIdx);
                }
            };
            rosterContainer.appendChild(btn);
        });
    }

    // ==========================================
    // 5. EVENT LISTENERS & LOOP
    // ==========================================

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            nextCharacter();
        } else if (e.key === 'ArrowLeft') {
            prevCharacter();
        } else if (e.key === 'Enter') {
            confirmSelection();
        }
    });
    
    // Add listeners for arrows
    const prevArrow = document.getElementById('nav-prev');
    const nextArrow = document.getElementById('nav-next');
    
    if (prevArrow) {
        prevArrow.addEventListener('click', prevCharacter);
    }
    
    if (nextArrow) {
        nextArrow.addEventListener('click', nextCharacter);
    }
    
    function nextCharacter() {
        currentIdx = (currentIdx + 1) % CHARACTERS.length;
        loadCharacter(currentIdx);
    }
    
    function prevCharacter() {
        currentIdx = (currentIdx - 1 + CHARACTERS.length) % CHARACTERS.length;
        loadCharacter(currentIdx);
    }

    const confirmBtn = document.getElementById('btn-confirm');
    if(confirmBtn) confirmBtn.addEventListener('click', confirmSelection);

    function confirmSelection() {
        const flash = document.getElementById('flash-overlay');
        const text = document.getElementById('locked-message');
        
        if (!flash || !text) return;

        flash.style.transition = 'opacity 0.1s';
        flash.style.opacity = '1';
        
        text.style.opacity = '1';
        text.style.transform = 'translate(-50%, -50%) scale(1)';

        setTimeout(() => {
            flash.style.transition = 'opacity 1s';
            flash.style.opacity = '0';
        }, 100);

        console.log(`LOCKED IN: ${CHARACTERS[currentIdx].name}`);
    }

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();

        // Mixer update
        if (mixer) mixer.update(delta);

        // Rotate Model slowly
        if (currentModel) {
            currentModel.rotation.y += 0.005;
        }

        // Particle Movement
        const positions = particlesMesh.geometry.attributes.position.array;
        for(let i=1; i<positions.length; i+=3) {
            positions[i] += 0.01; // Move up
            if (positions[i] > 2) positions[i] = -0.5; // Reset
        }
        particlesMesh.geometry.attributes.position.needsUpdate = true;
        particlesMesh.rotation.y -= 0.002;

        controls.update();
        renderer.render(scene, camera);
    }

    // ==========================================
    // 6. INITIALIZATION
    // ==========================================
    
    createRoster();
    loadCharacter(0);
    animate();
}

// Wait for DOM to be ready before running
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}