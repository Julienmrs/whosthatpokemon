"use strict";
// ⚠️ DO NOT EDIT main.js DIRECTLY ⚠️
// This file is generated from the TypeScript source main.ts
// Any changes made here will be overwritten.
// Import only what you need, to help your bundler optimize final code size using tree shaking
// see https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking)
import { PerspectiveCamera, Scene, WebGLRenderer, BoxGeometry, Mesh, AmbientLight, Clock, MeshPhongMaterial, SphereGeometry, PointLight, Color, CylinderGeometry, ConeGeometry, Raycaster, Vector2 } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TTFLoader } from 'three/addons/loaders/TTFLoader.js';
import { Font } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
// Example of hard link to official repo for data, if needed
// const MODEL_PATH = 'https://raw.githubusercontent.com/mrdoob/three.js/r173/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb';
// INSERT CODE HERE
var scene = new Scene();
scene.background = new Color(0xffffff);
var aspect = window.innerWidth / window.innerHeight;
var camera = new PerspectiveCamera(75, aspect, 0.1, 1000);
camera.position.set(0, 0, 55);
// camera.up.set(0, 0, 0);
// camera.lookAt(0, 0, 0);
var light = new AmbientLight(0xffffff, 1.0); // soft white light
scene.add(light);
var buttonSize = 10;
var font;
var loader = new TTFLoader();
function fontLoad() {
    loader.load('assets/fonts/kenpixel.ttf', function (json) {
        console.log("Font loaded");
        font = new Font(json);
        addTextToButtons();
    });
}
var renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var controls = new OrbitControls(camera, renderer.domElement);
controls.listenToKeyEvents(window); // optional
function createTextMesh(label, id) {
    var textGeo = new TextGeometry(label, {
        font: font,
        size: .8, // petit pour rentrer sur le bouton
        depth: 1,
        curveSegments: 4,
        bevelEnabled: false
    });
    textGeo.computeBoundingBox();
    textGeo.computeVertexNormals();
    if (!textGeo.boundingBox) {
        console.error("Failed to compute bounding box for text geometry.");
        return new Mesh(); // Return an empty mesh as a fallback
    }
    var centerOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
    var textMaterial = new MeshPhongMaterial({ color: 0xffffff });
    var textMesh = new Mesh(textGeo, textMaterial);
    textMesh.name = "text" + id; // Set the name to identify the text mesh
    // textMesh.rotation.x = Math.PI / 2;
    // textMesh.rotation.y = Math.PI;
    textMesh.position.x = centerOffset; // adjust horizontally
    textMesh.position.y = 0; // in front of the button
    textMesh.position.z = 4.3; // vertically
    return textMesh;
}
function addTextToButtons() {
    var labels = ["Cube", "Sphere", "Pyramid", "Cylinder"];
    buttons.forEach(function (button, index) {
        var textMesh = createTextMesh(labels[index], index);
        // Attacher le texte au bouton
        button.add(textMesh);
    });
}
function randomPokemonIndex(range) {
    if (range === void 0) { range = 151; }
    var randomIndex = Math.floor(Math.random() * range) + 1; // +1 to get a number between 1 and range
    var formattedNumber = String(randomIndex).padStart(3, '0');
    return formattedNumber;
}
function randomChoice() {
    var rdm = Number(randomPokemonIndex(4));
    var formtype = ["", "Cube", "Sphere", "Pyramid", "Cylinder"][rdm]; // Pour avoir une forme aleatoire parmi les 4 #TODO renplacer par les pokemons 
    return formtype;
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
function loadForm() {
    var formtype = randomChoice(); // TODO: remplacer par les modeles de pokemons
    var geometry;
    switch (formtype) {
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
    var materialForm = new MeshPhongMaterial({ color: 0x444444 });
    var form = new Mesh(geometry, materialForm);
    form.position.set(0, 0, 0);
    form.name = "form"; // Set the name to identify the form
    return form;
}
function loadData() {
    var idPokemon = "001"; // randomPokemonIndex(); // TODO: remplacer par les pokemons
    new GLTFLoader()
        .setPath('/assets/models/001/glTF/')
        .load('model.gltf', gltfReader);
}
loadData();
// Button to guess the right form #TODO: remplacer par les pokemons
function createButton(position) {
    var cube = new BoxGeometry(buttonSize, buttonSize, buttonSize);
    var material = new MeshPhongMaterial({ color: 0x808080 });
    var button = new Mesh(cube, material);
    button.position.set(position.x, position.y, position.z);
    return button;
}
// Buttons 
var button1 = createButton({ x: -30, y: -10, z: 20 });
var button2 = createButton({ x: -10, y: -10, z: 20 });
var button3 = createButton({ x: 10, y: -10, z: 20 });
var button4 = createButton({ x: 30, y: -10, z: 20 });
var buttons = [button1, button2, button3, button4];
buttons.forEach(function (button, index) {
    button.name = "button" + index; // Set the name to identify the buttons
    scene.add(button);
});
fontLoad();
{ // add lightpoint
    var color = 0xffffff;
    var intensity = 500;
    var light_1 = new PointLight(color, intensity);
    scene.add(light_1);
}
//init
var clock = new Clock();
var currentShape = loadForm();
var raycaster = new Raycaster();
var INTERSECTED;
var pointer = new Vector2(0, 0);
// console.log(scene.children); //debug to see the objects in the scene
// Main loop / render function
var animation = function () {
    renderer.setAnimationLoop(animation); // requestAnimationFrame() replacement, compatible with XR 
    var delta = clock.getDelta();
    var elapsed = clock.getElapsedTime();
    // intersection detection
    raycaster.setFromCamera(pointer, camera);
    var intersects = raycaster.intersectObjects(buttons, false);
    if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object) {
            if (INTERSECTED)
                INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex(0xff0000);
        }
    }
    else {
        if (INTERSECTED)
            INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
        INTERSECTED = null;
    }
    renderer.render(scene, camera);
};
// can be used in shaders: uniforms.u_time.value = elapsed;
renderer.render(scene, camera);
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
function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
// Change shape on click
document.addEventListener('mousemove', onPointerMove);
window.addEventListener("click", function () {
    scene.remove(currentShape);
    currentShape.geometry.dispose();
    currentShape.material.dispose();
    currentShape = loadForm();
    scene.add(currentShape);
    console.log(scene.children);
});
//# sourceMappingURL=main.js.map