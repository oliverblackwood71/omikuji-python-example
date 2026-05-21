import * as THREE from "three";

const canvas = document.querySelector("#fortune3d");
const stage = canvas.closest(".three-stage");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
  canvas,
  preserveDrawingBuffer: true,
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
camera.position.set(0, 0.3, 7);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.7);
const keyLight = new THREE.DirectionalLight(0xfff0bd, 2.4);
keyLight.position.set(-2, 4, 5);
const rimLight = new THREE.DirectionalLight(0x84b6ff, 1.4);
rimLight.position.set(3, 1, -2);
scene.add(ambientLight, keyLight, rimLight);

const inkMaterial = new THREE.MeshStandardMaterial({
  color: 0x172033,
  roughness: 0.45,
});
const boxMaterial = new THREE.MeshStandardMaterial({
  color: 0xffd84d,
  roughness: 0.38,
  metalness: 0.04,
});
const slipMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.5,
});
const redMaterial = new THREE.MeshStandardMaterial({
  color: 0xf04f4f,
  roughness: 0.45,
});

const omikujiGroup = new THREE.Group();
const box = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5, 4, 4, 4), boxMaterial);
const rim = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.11, 16, 40), inkMaterial);
rim.rotation.x = Math.PI / 2;
rim.position.y = 0.82;

const marker = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.08, 20), redMaterial);
marker.position.set(0, 0.03, 0.79);
marker.rotation.z = Math.PI / 2;

omikujiGroup.add(box, rim, marker);

const slips = [
  { x: -0.34, rotation: -0.18 },
  { x: 0, rotation: 0.06 },
  { x: 0.34, rotation: 0.2 },
].map(({ x, rotation }) => {
  const slip = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 1.45, 18), slipMaterial);
  slip.position.set(x, 1.28, 0);
  slip.rotation.z = rotation;
  omikujiGroup.add(slip);
  return slip;
});

const shadow = new THREE.Mesh(
  new THREE.CircleGeometry(1.32, 48),
  new THREE.MeshBasicMaterial({
    color: 0x172033,
    opacity: 0.12,
    transparent: true,
  }),
);
shadow.rotation.x = -Math.PI / 2;
shadow.position.y = -1.3;
scene.add(shadow, omikujiGroup);

let burst = 0;
let spinBoost = 0;
let lastTime = performance.now();

function setStagePosition() {
  const compact = stage.clientWidth < 240;
  omikujiGroup.position.set(0, 0, 0);
  omikujiGroup.scale.setScalar(compact ? 0.82 : 0.96);
  shadow.position.x = omikujiGroup.position.x;
  shadow.position.z = omikujiGroup.position.z;
  shadow.scale.setScalar(compact ? 0.82 : 0.96);
}

function resize() {
  const width = stage.clientWidth;
  const height = stage.clientHeight;

  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  setStagePosition();
}

function animate(time) {
  const delta = Math.min((time - lastTime) / 1000, 0.05);
  const t = time * 0.001;
  lastTime = time;
  burst = Math.max(0, burst - delta * 1.8);
  spinBoost = Math.max(0, spinBoost - delta * 1.4);

  omikujiGroup.rotation.y += delta * (0.6 + spinBoost * 5);
  omikujiGroup.rotation.z = Math.sin(t * 2.1) * 0.06 + Math.sin(t * 18) * burst * 0.12;
  omikujiGroup.position.y = Math.sin(t * 2.4) * 0.08;
  slips.forEach((slip, index) => {
    slip.position.y = 1.28 + Math.sin(t * 3.4 + index) * 0.06 + burst * 0.15;
  });
  shadow.scale.setScalar((stage.clientWidth < 240 ? 0.82 : 0.96) * (1 - burst * 0.08));

  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
}

window.addEventListener("resize", resize);
window.addEventListener("omikuji:draw-start", () => {
  burst = 1;
  spinBoost = 1;
});
window.addEventListener("omikuji:draw-result", (event) => {
  burst = event.detail.label === "大吉" ? 1.2 : 0.55;
});

resize();
window.requestAnimationFrame(animate);
