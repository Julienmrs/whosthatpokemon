"use strict";
// ⚠️ DO NOT EDIT main.js DIRECTLY ⚠️
// This file is generated from the TypeScript source main.ts
// Any changes made here will be overwritten.
// Import only what you need, to help your bundler optimize final code size using tree shaking
// see https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking)
import { PerspectiveCamera, Scene, WebGLRenderer, BoxGeometry, Mesh, AmbientLight, Clock, MeshPhongMaterial, SphereGeometry, PointLight, Color, CylinderGeometry, ConeGeometry } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// Example of hard link to official repo for data, if needed
// const MODEL_PATH = 'https://raw.githubusercontent.com/mrdoob/three.js/r173/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb';
// INSERT CODE HERE
var scene = new Scene();
scene.background = new Color(0xffffff);
var aspect = window.innerWidth / window.innerHeight;
var camera = new PerspectiveCamera(75, aspect, 0.1, 1000);
camera.position.set(0, 50, 0);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);
var light = new AmbientLight(0xffffff, 1.0); // soft white light
scene.add(light);
var renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var controls = new OrbitControls(camera, renderer.domElement);
controls.listenToKeyEvents(window); // optional
function randomPokemonIndex(range) {
    if (range === void 0) { range = 151; }
    var randomIndex = Math.floor(Math.random() * range) + 1; // +1 to get a number between 1 and range
    var formattedNumber = String(randomIndex).padStart(3, '0');
    return formattedNumber;
}
function gltfReader(gltf) {
    var testModel = null;
    testModel = gltf.scene;
    if (testModel != null) {
        console.log("Model loaded:  " + testModel);
        scene.add(gltf.scene);
    }
    else {
        console.log("Load FAILED.  ");
    }
}
function randomChoice() {
    var rdm = Number(randomPokemonIndex(3));
    var form = ["", "Cube", "Sphere", "Pyramid", "Cylinder"][rdm]; // Pour avoir une forme aleatoire parmi les 4 #TODO renplacer par les pokemons 
    return form;
}
function loadForm() {
    var form = randomChoice(); // TODO: remplacer par les modeles de pokemons
    var geometry;
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
    var material = new MeshPhongMaterial({ color: 0x000000 });
    var mesh = new Mesh(geometry, material);
    return mesh;
}
// function loadData() {
//   const idPokemon = randomPokemonIndex();
//   new GLTFLoader()
//     .setPath('assets/models/{}/gltf/'.replace('{}', idPokemon))
//     .load('model.gltf', gltfReader);
// }
{
    var color = 0xffffff;
    var intensity = 500;
    var light_1 = new PointLight(color, intensity);
    scene.add(light_1);
}
var clock = new Clock();
var currentShape = loadForm();
// Main loop
var animation = function () {
    renderer.setAnimationLoop(animation); // requestAnimationFrame() replacement, compatible with XR 
    var delta = clock.getDelta();
    var elapsed = clock.getElapsedTime();
    // can be used in shaders: uniforms.u_time.value = elapsed;
    renderer.render(scene, camera);
};
animation();
window.addEventListener('resize', onWindowResize, false);
// Resize responsive
window.addEventListener("resize", function () {
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
window.addEventListener("click", function () {
    scene.remove(currentShape);
    currentShape.geometry.dispose();
    currentShape.material.dispose();
    currentShape = loadForm();
    scene.add(currentShape);
});
//# sourceMappingURL=main.js.map