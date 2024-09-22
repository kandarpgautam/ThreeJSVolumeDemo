import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper(100);

const infoElement = document.getElementById("info");
const modelInfoTitle = document.getElementById("modelInfoTitle");

modelInfoTitle.addEventListener("click", () => {
  if (infoElement.classList.contains("closed")) {
    infoElement.classList.remove("closed");
    modelInfoTitle.classList.remove("collapsed");
  } else {
    infoElement.classList.add("closed");
    modelInfoTitle.classList.add("collapsed");
  }
});

// materials
const materials = {};

const shadingOptions = [
  "wireframe",
  "normal",
  // "flat",
  // "glossy",
  // "textured",
  // "reflective",
];

let currentEffects = {
  tessellation: -1,
  shading: "normal",
  showAxes: false,
};

let selectedEffects = JSON.parse(JSON.stringify(currentEffects));

materials["wireframe"] = new THREE.MeshBasicMaterial({ wireframe: true });
materials["normal"] = new THREE.MeshStandardMaterial({
  side: THREE.DoubleSide,
  wireframe: false,
});
// materials[ 'flat' ] = new THREE.MeshPhongMaterial( { specular: 0x000000, flatShading: true, side: THREE.DoubleSide } );
// materials[ 'glossy' ] = new THREE.MeshPhongMaterial( { side: THREE.DoubleSide } );
// materials[ 'textured' ] = new THREE.MeshPhongMaterial( { map: textureMap, side: THREE.DoubleSide } );
// materials[ 'reflective' ] = new THREE.MeshPhongMaterial( { envMap: textureCube, side: THREE.DoubleSide } );

const onEffectsChanged = () => {
  // console.log(`selected effects: ${selectedEffects.shading} ${selectedEffects.tessellation}, Current Effects:${currentEffects.shading} ${currentEffects.tessellation}`)
  if (
    selectedEffects.tessellation != currentEffects.tessellation ||
    selectedEffects.shading != currentEffects.shading
  ) {
    loadGeometry();
  }
  render();
};

const onShowAxeschanged = (e) => {
  if (e) {
    scene.add(axesHelper);
  } else {
    scene.remove(axesHelper);
  }
};

const setupGUI = () => {
  const gui = new GUI();

  gui
    .add(selectedEffects, "showAxes")
    .name("Show Axes")
    .onChange(onShowAxeschanged);

  // gui
  //   .add(
  //     selectedEffects,
  //     "tessellation",
  //     [2, 3, 4, 5, 6, 8, 10, 15, 20, 30, 40, 50]
  //   )
  //   .name("Tessellation Level")
  //   .onChange(onEffectsChanged);

  gui
    .add(selectedEffects, "shading", shadingOptions)
    .name("Shading")
    .onChange(onEffectsChanged);
};

setupGUI();

let mesh;

function loadGeometry() {
  const urlParams = new URLSearchParams(window.location.search);
  const filePath = urlParams.get("filePath");
  loader.load(
    filePath,
    function (geometry) {
      geometry.center();
      scene.remove(mesh);
      mesh = new THREE.Mesh(geometry, materials[selectedEffects.shading]);
      scene.add(mesh);
      progressBar.style.display = "none";
      currentEffects = JSON.parse(JSON.stringify(selectedEffects));
      infoElement.innerHTML = `<table>
        <tbody>
          <tr>
            <td>Surface volume</td>
            <td>${(getVolume(geometry) / 100).toFixed(3)} cm<sup>2</sup></td>
          </tr>
          <tr>
            <td>Volume</td>
            <td>${(getVolume(geometry) / 1000).toFixed(
              3
            )} cm<sup>3</sup><br/></td>
          </tr>
        </tbody>
      </table>
      `;
    },
    (xhr) => {
      if (xhr.lengthComputable) {
        var percentComplete = (xhr.loaded / xhr.total) * 100;
        progressBar.value = percentComplete;
        progressBar.style.display = "block";
      }
    },
    (error) => {
      console.log(error);
    }
  );
}

const loader = new STLLoader();

loadGeometry();

const lightTop = new THREE.DirectionalLight();
lightTop.position.set(0, 7.5, 0);
scene.add(lightTop);

const lightBottom = new THREE.DirectionalLight();
lightBottom.position.set(0, -7.5, 0);
scene.add(lightBottom);

const ambientLight = new THREE.AmbientLight(0xaaaaaa); // soft white light
scene.add(ambientLight);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);

camera.position.z = 50;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}
window.addEventListener("resize", onWindowResize, false);

const stats = new Stats();
document.body.appendChild(stats.dom);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

animate();

function getVolume(geometry) {
  let position = geometry.attributes.position;
  let faces = position.count / 3;
  let sum = 0;
  let p1 = new THREE.Vector3(),
    p2 = new THREE.Vector3(),
    p3 = new THREE.Vector3();
  for (let i = 0; i < faces; i++) {
    p1.fromBufferAttribute(position, i * 3 + 0);
    p2.fromBufferAttribute(position, i * 3 + 1);
    p3.fromBufferAttribute(position, i * 3 + 2);
    sum += signedVolumeOfTriangle(p1, p2, p3);
  }
  return sum;
}

function signedVolumeOfTriangle(p1, p2, p3) {
  return p1.dot(p2.cross(p3)) / 6.0;
}
