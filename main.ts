"use strict";

// ⚠️ DO NOT EDIT main.js DIRECTLY ⚠️
// This file is generated from the TypeScript source main.ts
// Any changes made here will be overwritten.

// Import only what you need, to help your bundler optimize final code size using tree shaking
// see https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking)

import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  BoxGeometry,
  Mesh,
  MeshNormalMaterial,
  AmbientLight,
  Clock,
  MeshPhongMaterial,
  SphereGeometry,
  PointLight,
  Color,
  CylinderGeometry,
  ConeGeometry,
  Material
} from 'three';


import {
  OrbitControls
} from 'three/addons/controls/OrbitControls.js';

import {
  GLTF,
  GLTFLoader
} from 'three/addons/loaders/GLTFLoader.js';
import { seededRandom } from 'three/src/math/MathUtils.js';
import { int } from 'three/src/nodes/tsl/TSLBase.js';

// Example of hard link to official repo for data, if needed
// const MODEL_PATH = 'https://raw.githubusercontent.com/mrdoob/three.js/r173/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb';


// INSERT CODE HERE

const scene = new Scene();
scene.background = new Color(0xffffff);
const aspect = window.innerWidth / window.innerHeight;
const camera = new PerspectiveCamera(75, aspect, 0.1, 1000);
camera.position.set(0, 50, 0);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);
const light = new AmbientLight(0xffffff, 1.0); // soft white light
scene.add(light);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.listenToKeyEvents(window); // optional

function randomPokemonIndex(range: number = 151) {
  const randomIndex = Math.floor(Math.random() * range) + 1; // +1 to get a number between 1 and range
  const formattedNumber = String(randomIndex).padStart(3, '0');
  return formattedNumber;
}

function gltfReader(gltf: GLTF) {
  let testModel = null;

  testModel = gltf.scene;

  if (testModel != null) {
    console.log("Model loaded:  " + testModel);
    scene.add(gltf.scene);
  } else {
    console.log("Load FAILED.  ");
  }
}

function randomChoice() {
  const rdm = Number(randomPokemonIndex(3));
  const form = ["", "Cube", "Sphere", "Pyramid", "Cylinder"][rdm]; // Pour avoir une forme aleatoire parmi les 4 #TODO renplacer par les pokemons 
  return form;
}

function loadForm() {
  const form = randomChoice();  // TODO: remplacer par les modeles de pokemons
  let geometry;

  switch (form) {
    case "Cube":
      geometry = new BoxGeometry(10, 10, 10);
      break;
    case "Sphere":
      geometry = new SphereGeometry(5, 20, 20);
      break;
    case "Pyramid":
      geometry = new ConeGeometry(5, 10, 4);
      break;
    case "Cylinder":
      geometry = new CylinderGeometry(5, 5, 10, 20);
      break;

  }
  const material = new MeshPhongMaterial({ color: 0x000000 });
  const mesh = new Mesh(geometry, material);
  return mesh;
}

// function loadData() {
//   const idPokemon = randomPokemonIndex();
//   new GLTFLoader()
//     .setPath('assets/models/{}/gltf/'.replace('{}', idPokemon))
//     .load('model.gltf', gltfReader);
// }







{
  const color = 0xffffff;
  const intensity = 500;
  const light = new PointLight(color, intensity);
  scene.add(light);
}

const clock = new Clock();

let currentShape: Mesh = loadForm();
// Main loop
const animation = () => {

  renderer.setAnimationLoop(animation); // requestAnimationFrame() replacement, compatible with XR 

  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();



  // can be used in shaders: uniforms.u_time.value = elapsed;


  renderer.render(scene, camera);
};

animation();

window.addEventListener('resize', onWindowResize, false);


// Resize responsive
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

}

// Change shape on click
window.addEventListener("click", () => {
  scene.remove(currentShape);
  currentShape.geometry.dispose();
  (currentShape.material as Material).dispose();

  currentShape = loadForm();
  scene.add(currentShape);
});