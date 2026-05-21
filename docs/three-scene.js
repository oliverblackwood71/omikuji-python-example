import * as THREE from "three";

const canvas = document.querySelector("#fortune3d");
const stage = canvas.closest(".three-stage");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
  canvas,
  preserveDrawingBuffer: true,
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
camera.position.set(0, 1.9, 9.2);
camera.lookAt(0, 0.2, 0);

const ambientLight = new THREE.HemisphereLight(0xfff7dd, 0x44658d, 2.2);
const keyLight = new THREE.DirectionalLight(0xffe4a3, 3.2);
keyLight.position.set(-3, 5, 5);
const rimLight = new THREE.DirectionalLight(0x8fd6ff, 1.8);
rimLight.position.set(4, 2, -4);
scene.add(ambientLight, keyLight, rimLight);

const lacquerMaterial = new THREE.MeshStandardMaterial({
  color: 0xb83b2f,
  metalness: 0.16,
  roughness: 0.28,
});
const goldMaterial = new THREE.MeshStandardMaterial({
  color: 0xf2c445,
  metalness: 0.22,
  roughness: 0.34,
});
const inkMaterial = new THREE.MeshStandardMaterial({
  color: 0x172033,
  roughness: 0.42,
});
const paperMaterial = new THREE.MeshStandardMaterial({
  color: 0xfff7e7,
  roughness: 0.5,
});
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0x9f6036,
  roughness: 0.84,
});
const glowMaterial = new THREE.MeshBasicMaterial({
  color: 0xffd84d,
  opacity: 0.18,
  transparent: true,
});

const world = new THREE.Group();
scene.add(world);

const table = new THREE.Mesh(new THREE.CylinderGeometry(4.8, 5.3, 0.52, 64), floorMaterial);
table.position.y = -2.05;
table.scale.z = 0.56;
world.add(table);

const halo = new THREE.Mesh(new THREE.CircleGeometry(2.38, 64), glowMaterial);
halo.rotation.x = -Math.PI / 2;
halo.position.y = -1.77;
world.add(halo);

const omikuji = new THREE.Group();
omikuji.position.y = -0.12;
world.add(omikuji);

const body = new THREE.Mesh(new THREE.CylinderGeometry(1.13, 1.22, 3.14, 12), lacquerMaterial);
body.castShadow = true;
omikuji.add(body);

const goldTop = new THREE.Mesh(new THREE.CylinderGeometry(1.18, 1.18, 0.16, 12), goldMaterial);
goldTop.position.y = 1.57;
omikuji.add(goldTop);

const goldBase = new THREE.Mesh(new THREE.CylinderGeometry(1.27, 1.27, 0.2, 12), goldMaterial);
goldBase.position.y = -1.57;
omikuji.add(goldBase);

const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.11, 18, 48), inkMaterial);
mouth.rotation.x = Math.PI / 2;
mouth.position.y = 1.69;
omikuji.add(mouth);

const mouthDark = new THREE.Mesh(new THREE.CircleGeometry(0.46, 48), inkMaterial);
mouthDark.rotation.x = -Math.PI / 2;
mouthDark.position.y = 1.685;
omikuji.add(mouthDark);

const frontPanel = new THREE.Mesh(new THREE.BoxGeometry(0.52, 1.88, 0.04), goldMaterial);
frontPanel.position.set(0, -0.02, 1.145);
omikuji.add(frontPanel);

const sealTop = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 24), inkMaterial);
sealTop.position.set(0, 0.54, 1.19);
const sealBottom = sealTop.clone();
sealBottom.position.y = -0.54;
omikuji.add(sealTop, sealBottom);

const stickStarts = [-0.34, 0, 0.34];
const sticks = stickStarts.map((x, index) => {
  const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 2.05, 18), paperMaterial);
  stick.position.set(x, 2.46, 0.02);
  stick.rotation.z = (index - 1) * 0.12;
  omikuji.add(stick);
  return stick;
});

const luckyStick = new THREE.Group();
const luckyRod = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 2.42, 20), paperMaterial);
const luckyCap = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.34, 20), goldMaterial);
luckyCap.position.y = 1.04;
luckyStick.add(luckyRod, luckyCap);
luckyStick.position.set(0.12, 1.2, 0.1);
luckyStick.visible = false;
omikuji.add(luckyStick);

const slipGlow = new THREE.Mesh(new THREE.RingGeometry(0.42, 0.78, 48), glowMaterial);
slipGlow.position.set(0, 2.12, 0.18);
slipGlow.visible = false;
omikuji.add(slipGlow);

let shakePower = 0;
let liftPower = 0;
let resultPulse = 0;
let lastTime = performance.now();

function resize() {
  const width = stage.clientWidth;
  const height = stage.clientHeight;

  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.position.z = width < 520 ? 10.2 : 9.2;
  camera.updateProjectionMatrix();
}

function animate(time) {
  const delta = Math.min((time - lastTime) / 1000, 0.05);
  const t = time * 0.001;
  lastTime = time;
  shakePower = Math.max(0, shakePower - delta * 1.65);
  liftPower = Math.max(0, liftPower - delta * 1.08);
  resultPulse = Math.max(0, resultPulse - delta * 1.4);

  omikuji.rotation.y = Math.sin(t * 0.8) * 0.2 + Math.sin(t * 16) * shakePower * 0.24;
  omikuji.rotation.z = Math.sin(t * 2.2) * 0.035 + Math.sin(t * 22) * shakePower * 0.18;
  omikuji.position.y = -0.12 + Math.sin(t * 2.4) * 0.06 + shakePower * 0.12;
  omikuji.scale.setScalar(1 + resultPulse * 0.045);
  sticks.forEach((stick, index) => {
    stick.position.y = 2.46 + Math.sin(t * 3.3 + index) * 0.045 + shakePower * 0.16;
  });

  luckyStick.visible = liftPower > 0.02;
  slipGlow.visible = liftPower > 0.05 || resultPulse > 0.05;
  luckyStick.position.y = 1.2 + liftPower * 2.16;
  luckyStick.rotation.z = liftPower * -0.28 + Math.sin(t * 18) * shakePower * 0.08;
  slipGlow.material.opacity = 0.12 + Math.max(liftPower, resultPulse) * 0.38;
  slipGlow.scale.setScalar(0.8 + Math.max(liftPower, resultPulse) * 0.75);
  halo.material.opacity = 0.12 + resultPulse * 0.18;
  halo.scale.setScalar(1 + resultPulse * 0.18);

  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
}

window.addEventListener("resize", resize);
window.addEventListener("omikuji:draw-start", () => {
  shakePower = 1;
  liftPower = 1;
});
window.addEventListener("omikuji:shake-preview", () => {
  shakePower = Math.max(shakePower, 0.42);
});
window.addEventListener("omikuji:draw-result", (event) => {
  resultPulse = event.detail.label === "大吉" ? 1.35 : 0.82;
  body.material.color.set(event.detail.label === "大吉" ? 0xc32838 : 0xb83b2f);
});

resize();
window.requestAnimationFrame(animate);
