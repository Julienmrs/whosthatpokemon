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
    Object3D,
    MeshBasicMaterial,
    HemisphereLight,
    DirectionalLight
} from 'three';


import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';

import {
    GLTF,
    GLTFLoader
} from 'three/addons/loaders/GLTFLoader.js';

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
const light = new AmbientLight(0xffffff, 1); // soft white light
const dirLight = new DirectionalLight(0xffffff, 3);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);
const hemiLight = new HemisphereLight(0xffffff, 0x444444, 2);
scene.add(hemiLight);
const renderer = new WebGLRenderer();
scene.add(light);

const buttonSize = 10;
let font: Font;

const loader = new TTFLoader();
let currentPokemon: Object3D | null = null;
let currentPokemonName: string = "";
const originalMaterials = new Map<Mesh, Material | Material[]>();

let raycaster = new Raycaster();
let INTERSECTED: any;
let pointer = new Vector2(0, 0);
let lstPokemon: string[] = [];
const clock = new Clock();


function fontLoad() {
    loader.load('assets/fonts/kenpixel.ttf', function (json) {
        console.log("Font loaded");
        font = new Font(json);
        addTextToButtons();
    });
}

async function listPokemonLoad(): Promise<string[]> {
    const response = await fetch("/assets/lst_pokemon.txt");
    const text = await response.text();

    const list = text
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0);

    return list;
}

listPokemonLoad().then(list => {
    console.log(list);
    lstPokemon = list;
});


renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.listenToKeyEvents(window); // optional

function randomPokemon(): string {
    if (lstPokemon.length === 0) return "";
    const randomIndex = Math.floor(Math.random() * lstPokemon.length);
    return lstPokemon[randomIndex];
}

function gltfReader(gltf: GLTF) {
    const model = convertGLTFModel(gltf, 25);
    model.traverse((obj) => {
        if ((obj as Mesh).isMesh) {
            const mesh = obj as Mesh;
            originalMaterials.set(mesh, mesh.material);
            mesh.material = new MeshBasicMaterial({
                color: 0x000000
            });
            // mesh.material = originalMaterials.get(mesh)!;
        }
    });
    if (currentPokemon) { scene.remove(currentPokemon) }
    currentPokemon = model;
    scene.add(currentPokemon);
    console.log("Model loaded:  " + currentPokemonName);
}

function loadData() {
    const idPokemon: string = randomPokemon();
    if (!idPokemon) return;
    currentPokemonName = idPokemon;
    new GLTFLoader()
        .setPath('/assets/Pokemon_models/' + idPokemon)
        .setResourcePath('/assets/Pokemon_models/' + idPokemon + '/images/')
        .load('/' + idPokemon.toLowerCase() + '.glb', gltfReader);
}

listPokemonLoad().then(list => {
    lstPokemon = list;
    loadData();
});



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
let button1 = createButton("Button1", { x: -30, y: -10, z: 20 });
let button2 = createButton("Button2", { x: -10, y: -10, z: 20 });
let button3 = createButton("Button3", { x: 10, y: -10, z: 20 });
let button4 = createButton("Button4", { x: 30, y: -10, z: 20 });

let buttons = [button1, button2, button3, button4];
buttons.forEach(button => scene.add(button));

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

    textMesh.position.x = centerOffset; // adjust horizontally
    textMesh.position.y = 0; // in front of the button
    textMesh.position.z = 4.3; // vertically

    return textMesh;
}

function addTextToButtons() {

    const randomPokemonNames = [currentPokemonName];
    while (randomPokemonNames.length < buttons.length) {
        const randomIndex = Math.floor(Math.random() * lstPokemon.length);
        const pokemonName = lstPokemon[randomIndex];
        if (!randomPokemonNames.includes(pokemonName) && pokemonName !== currentPokemonName) {
            randomPokemonNames.push(pokemonName);
        }
    }
    buttons.forEach((button, index) => {
        button.name = randomPokemonNames[index]; // Set the button name to the Pokemon name for identification
        const textMesh = createTextMesh(randomPokemonNames[index], index);
        button.remove(...button.children); // Remove existing text if any
        // Attacher le texte au bouton
        button.add(textMesh);

    });
}

fontLoad();


const timer = new Timer();
timer.connect(document);
// Main loop / render function
const animation = () => {

    renderer.setAnimationLoop(animation); // requestAnimationFrame() replacement, compatible with XR 

    timer.update();
    //const delta = timer.getDelta();
    const elapsed = timer.getElapsed();
    if (currentPokemon) {
        currentPokemon.rotation.y = elapsed * 0.5;
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
        console.log(currentPokemonName === clickedButton.name); // Check if the names match
        changeShape();
        addTextToButtons();
    }
}

function changeShape() {
    if (!currentPokemon) return;
    scene.remove(currentPokemon);
    loadData();
}

function convertGLTFModel(gltf: GLTF, maxAllowedSize = 40): Object3D {

    const model = gltf.scene;

    const box = new Box3().setFromObject(model);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());

    const maxAxis = Math.max(size.x, size.y, size.z);

    if (maxAxis > maxAllowedSize) {
        const scale = maxAllowedSize / maxAxis;
        model.scale.setScalar(scale);
    }

    box.setFromObject(model);
    const newCenter = box.getCenter(new Vector3());

    model.position.sub(newCenter);

    box.setFromObject(model);
    model.position.y -= box.min.y;

    return model;
}

document.addEventListener('click', try_onClick);
document.addEventListener('mousemove', onPointerMove);