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
    Material,
    Raycaster,
    Vector2,
    Timer,
    Box3,
    Vector3,
    Object3D
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


import { TTFLoader } from 'three/addons/loaders/TTFLoader.js';
import { Font } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';






// INSERT CODE HERE

// Init
const scene = new Scene();
scene.background = new Color(0xffffff);
const aspect = window.innerWidth / window.innerHeight;
const camera = new PerspectiveCamera(75, aspect, 0.1, 1000);
camera.position.set(0, 0, 55);
const light = new AmbientLight(0xffffff, 1.0); // soft white light
const renderer = new WebGLRenderer();
scene.add(light);

const buttonSize = 10;
let font: Font;

const loader = new TTFLoader();
let currentShape: Mesh;
let currentForm: string;
let pokemonModel: Object3D | null = null;
currentShape = loadForm();

let raycaster = new Raycaster();
let INTERSECTED: any;
let pointer = new Vector2(0, 0);

const clock = new Clock();


function fontLoad() {
    loader.load('assets/fonts/kenpixel.ttf', function (json) {
        console.log("Font loaded");
        font = new Font(json);
        addTextToButtons();
    });
}


renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.listenToKeyEvents(window); // optional


function createTextMesh(label: string, id: number): Mesh {

    const textGeo = new TextGeometry(label, {
        font: font,
        size: .8,          // petit pour rentrer sur le bouton
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
    const centerOffset = - 0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);


    const textMaterial = new MeshPhongMaterial({ color: 0xffffff });

    const textMesh = new Mesh(textGeo, textMaterial);
    textMesh.name = "text" + id; // Set the name to identify the text mesh

    // textMesh.rotation.x = Math.PI / 2;
    // textMesh.rotation.y = Math.PI;
    textMesh.position.x = centerOffset; // adjust horizontally
    textMesh.position.y = 0; // in front of the button
    textMesh.position.z = 4.3; // vertically


    return textMesh;
}

function addTextToButtons() {

    const labels = ["Cube", "Sphere", "Pyramid", "Cylinder"];

    buttons.forEach((button, index) => {

        const textMesh = createTextMesh(labels[index], index);

        // Attacher le texte au bouton
        button.add(textMesh);

    });
}


function randomPokemonIndex(range: number = 151) {
    const randomIndex = Math.floor(Math.random() * range) + 1; // +1 to get a number between 1 and range
    const formattedNumber = String(randomIndex).padStart(3, '0');
    return formattedNumber;
}


function randomChoice() {
    const rdm = Number(randomPokemonIndex(4));
    const formtype: string = ["", "Cube", "Sphere", "Pyramid", "Cylinder"][rdm]; // Pour avoir une forme aleatoire parmi les 4 #TODO renplacer par les pokemons 
    return formtype;
}

function gltfReader(gltf: GLTF) {

    pokemonModel = gltf.scene;

    if (pokemonModel != null) {
        console.log("Model loaded:  " + pokemonModel.name);
        gltf.scene.position.set(0, -10, -50);
        scene.add(gltf.scene);
    } else {
        console.log("Load FAILED.  ");
    }
}

function loadForm() {
    const formtype = randomChoice();  // TODO: remplacer par les modeles de pokemons
    let geometry;

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

    const materialForm = new MeshPhongMaterial({ color: 0x444444 });
    const form = new Mesh(geometry, materialForm);
    form.position.set(0, 0, 0);
    form.name = formtype; // Set the name to identify the form
    return form;
}



function loadData() {
    const idPokemon: string = "001"; // randomPokemonIndex(); // TODO: remplacer par les pokemons

    new GLTFLoader()
        .setPath('/assets/models/001/')
        .load('Bulbasaur.glb', gltfReader);
}
loadData();


// Button to guess the right form #TODO: remplacer par les pokemons
function createButton(label: string, position: { x: number, y: number, z: number }) {
    let cube = new BoxGeometry(buttonSize, buttonSize, buttonSize);
    let material = new MeshPhongMaterial({ color: 0x808080 });
    let button = new Mesh(cube, material);
    button.name = label; // Set the name to identify the button
    button.position.set(position.x, position.y, position.z);
    return button;
}
// Buttons 
let button1 = createButton("Cube", { x: -30, y: -10, z: 20 });
let button2 = createButton("Sphere", { x: -10, y: -10, z: 20 });
let button3 = createButton("Pyramid", { x: 10, y: -10, z: 20 });
let button4 = createButton("Cylinder", { x: 30, y: -10, z: 20 });

let buttons = [button1, button2, button3, button4];
buttons.forEach(button => scene.add(button));


fontLoad();

{ // add lightpoint
    const color = 0xffffff;
    const intensity = 500;
    const light = new PointLight(color, intensity);
    scene.add(light);
}



// console.log(scene.children); //debug to see the objects in the scene


const timer = new Timer();
scene.add(currentShape)
timer.connect(document);
// Main loop / render function
const animation = () => {

    renderer.setAnimationLoop(animation); // requestAnimationFrame() replacement, compatible with XR 

    timer.update();
    //const delta = timer.getDelta();
    const elapsed = timer.getElapsed();
    if (pokemonModel) {
        // pokemonModel.rotation.x = elapsed / 2;
        pokemonModel.rotation.y = elapsed / 1;
    }
    // intersection detection
    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects(buttons, false);

    if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object) {

            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex(0xff0000);
        }

    } else {

        if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
        INTERSECTED = null;

    }

    renderer.render(scene, camera);

}

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

function onPointerMove(event: MouseEvent) {

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

}

function try_onClick(event: MouseEvent) {
    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects(buttons, false);

    if (intersects.length > 0) {
        const clickedButton = intersects[0].object;
        // console.log("Clicked on button: " + clickedButton.name);
        // console.log("Current shape: " + currentShape.name);
        console.log(currentShape.name === clickedButton.name); // Check if the names match
        changeShape();
    }
}

function changeShape() {
    scene.remove(currentShape);
    currentShape.geometry.dispose();
    (currentShape.material as Material).dispose();

    currentShape = loadForm();
    scene.add(currentShape);
    // console.log(scene.children);

}

document.addEventListener('click', try_onClick);
document.addEventListener('mousemove', onPointerMove);