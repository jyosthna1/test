let scene, camera, renderer, cube, controls;
let rotationSpeed = 0.01;
const boundary = 2;

// Setup Scene
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.set(0, 0, 5); // Keep the cube in front of the camera

renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('three-canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);


// Cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
cube = new THREE.Mesh(geometry, material);
scene.add(cube);
renderer.render(scene, camera);

// Lighting
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 2, 2).normalize();
scene.add(directionalLight);

// Controls (optional)
controls = new THREE.OrbitControls(camera, renderer.domElement);

// Event Listeners
document.getElementById("rotationSpeed").oninput = e => {
  rotationSpeed = parseFloat(e.target.value);
  document.getElementById("speed-display").textContent = rotationSpeed.toFixed(2);
};

document.getElementById("left").onclick = () => moveCube("x", -0.1);
document.getElementById("right").onclick = () => moveCube("x", 0.1);
document.getElementById("up").onclick = () => moveCube("y", 0.1);
document.getElementById("down").onclick = () => moveCube("y", -0.1);

document.getElementById("reset").onclick = () => {
  cube.position.set(0, 0, 0);
  rotationSpeed = 0.01;
  document.getElementById("rotationSpeed").value = rotationSpeed;
  document.getElementById("speed-display").textContent = rotationSpeed.toFixed(2);
};

document.getElementById("save").onclick = async () => {
  const state = {
    id: "cube_1",
    position: cube.position,
    rotationSpeed,
    updatedAt: new Date().toISOString()
  };
  await fetch(`/api/cubes/cube_1/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(state)
  });
  alert("Cube state saved!");
};

// Restore state on load
(async () => {
  const res = await fetch(`/api/cubes/cube_1`);
  if (res.ok) {
    const data = await res.json();
    cube.position.set(data.position.x, data.position.y, data.position.z);
    rotationSpeed = data.rotationSpeed;
    document.getElementById("rotationSpeed").value = rotationSpeed;
    document.getElementById("speed-display").textContent = rotationSpeed.toFixed(2);
  }
})();

// Render Loop
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += rotationSpeed;
  cube.rotation.y += rotationSpeed;

 
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
