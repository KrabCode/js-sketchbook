// Set up Three.js renderer, scene, and camera
const container = document.getElementById('container');
const width = window.innerWidth;
const height = window.innerHeight;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

// Set a very dark (but not black) background color
renderer.setClearColor(0x181820, 1);

const scene = new THREE.Scene();

// Use a PerspectiveCamera for 3D rendering
const camera = new THREE.PerspectiveCamera(
  45, width / height, 0.1, 2000
);
camera.position.set(0, 0, 900);
camera.lookAt(0, 0, 0);

// Create an offscreen canvas for the texture
const canvasSize = 2048;
const offCanvas = document.createElement('canvas');
offCanvas.width = canvasSize;
offCanvas.height = canvasSize;
const ctx = offCanvas.getContext('2d');
// Fill background
ctx.fillStyle = '#222';
ctx.fillRect(0, 0, canvasSize, canvasSize);

// Write random white points (stars)
for (let i = 0; i < 10000; i++) {
  const x = Math.random() * canvasSize;
  const y = Math.random() * canvasSize;
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(x, y, 1, 0, Math.PI * 2);
  ctx.fill();
}

// Create texture from canvas
const texture = new THREE.CanvasTexture(offCanvas);

// Create a sphere
const sphereGeometry = new THREE.SphereGeometry(200, 64, 64);
// Use MeshPhysicalMaterial for more realistic lighting and reflections
const sphereMaterial = new THREE.MeshPhysicalMaterial({
  map: texture,
  roughness: 0.7,
  metalness: 0.0,
  clearcoat: 0.6,
  clearcoatRoughness: 0.3,
  reflectivity: 0.2,
  sheen: 0.2
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// Add a directional light and ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);
// Optionally, increase directional light intensity and add a small point light for a sun effect
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.2);
directionalLight.position.set(1, 1, 2);
scene.add(directionalLight);
const sun = new THREE.PointLight(0x0f0fff, 1.5, 10);
sun.position.set(-200, 1200, 100);
scene.add(sun);

// --- Atmospheric scattering effect ---
// Add a slightly larger transparent blue sphere for atmosphere
const atmosphereGeometry = new THREE.SphereGeometry(210, 64, 64);
const atmosphereMaterial = new THREE.MeshPhongMaterial({
  color: 0x3399ff,
  transparent: true,
  opacity: 0.18,
  side: THREE.FrontSide,
  shininess: 10,
  emissive: 0x30990f,
  emissiveIntensity: 0.2
});
const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
atmosphere.position.copy(sphere.position);
scene.add(atmosphere);

// Use a constant speed for rotation
const ROTATION_SPEED = 0.01;

// Render loop
function animate() {
  sphere.rotation.y += ROTATION_SPEED;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

// Update resize handler for PerspectiveCamera
window.addEventListener('resize', () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
});
