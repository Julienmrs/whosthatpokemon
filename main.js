"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// ⚠️ DO NOT EDIT main.js DIRECTLY ⚠️
// This file is generated from the TypeScript source main.ts
// Any changes made here will be overwritten.
// Import only what you need, to help your bundler optimize final code size using tree shaking
// see https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking)
import { PerspectiveCamera, Scene, WebGLRenderer, BoxGeometry, Mesh, AmbientLight, MeshPhongMaterial, Color, Raycaster, Vector2, Timer, Box3, Vector3, MeshBasicMaterial, HemisphereLight, DirectionalLight, MeshToonMaterial, NearestFilter, DataTexture, RGBAFormat, } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TTFLoader } from 'three/addons/loaders/TTFLoader.js';
import { Font } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
// INSERT CODE HERE
// Init
var scene = new Scene();
scene.background = new Color(0xffffff);
var aspect = window.innerWidth / window.innerHeight;
var camera = new PerspectiveCamera(75, aspect, 0.1, 1000);
camera.position.set(0, 0, 55);
camera.layers.enable(0);
var light = new AmbientLight(0xffffff, 1); // soft white light
var dirLight = new DirectionalLight(0xffffff, 3);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);
var hemiLight = new HemisphereLight(0xffffff, 0x444444, 2);
scene.add(hemiLight);
var renderer = new WebGLRenderer();
scene.add(light);
var pokemonLight = new DirectionalLight(0xffffff, 3);
pokemonLight.position.set(10, 20, 10);
pokemonLight.layers.set(1); // n’éclaire que le layer 1
scene.add(pokemonLight);
light.layers.set(0);
dirLight.layers.set(0);
hemiLight.layers.disable(1);
hemiLight.layers.enable(0);
var originalAmbientColor = light.color.clone();
var originalDirColor = dirLight.color.clone();
var originalHemiSkyColor = hemiLight.color.clone();
var originalHemiGroundColor = hemiLight.groundColor.clone();
var buttonSize = 10;
var font;
var loader = new TTFLoader();
var currentPokemon = null;
var currentPokemonName = "";
var originalMaterials = new Map();
var raycaster = new Raycaster();
var INTERSECTED;
var pointer = new Vector2(0, 0);
var lstPokemon = [];
var score = 0;
var scoreMesh = null;
var gameDuration = 60; // secondes
var answerDuration = 500; //millisecondes
var gameStarted = true;
var infiniteMode = false;
var gameState = "menu";
var timerMesh = null;
var endMesh = null;
var cdtBlock = false;
var currentFilter = "all";
var lstPokemonFound = [];
var datatexture = new Uint8Array([
    0, 0, 0, 255,
    128, 128, 128, 255,
    200, 200, 200, 255,
    255, 255, 255, 255
]);
var toonGradient = new DataTexture(datatexture, 4, 1, RGBAFormat);
toonGradient.needsUpdate = true;
toonGradient.minFilter = NearestFilter;
toonGradient.magFilter = NearestFilter;
function fontLoad() {
    loader.load('assets/fonts/kenpixel.ttf', function (json) {
        // console.log("Font loaded");
        font = new Font(json);
        showMenu();
        updateScoreDisplay();
    });
}
fontLoad();
function listPokemonLoad() {
    return __awaiter(this, void 0, void 0, function () {
        var response, text, list;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("/assets/lst_pokemon.txt")];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.text()];
                case 2:
                    text = _a.sent();
                    list = text
                        .split("\n")
                        .map(function (line) { return line.trim(); })
                        .filter(function (line) { return line.length > 0; });
                    return [2 /*return*/, list];
            }
        });
    });
}
listPokemonLoad().then(function (list) {
    // console.log(list);
    lstPokemon = list;
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var controls = new OrbitControls(camera, renderer.domElement);
controls.listenToKeyEvents(window); // optional
function randomPokemon() {
    var lstAvailable = availablePokemon();
    if (lstAvailable.length === 0) {
        alert("Tous les Pokémon ont été trouvés !");
        showMenu();
        return "";
    }
    var randomIndex = Math.floor(Math.random() * lstAvailable.length);
    return lstAvailable[randomIndex];
}
function gltfReader(gltf) {
    var model = convertGLTFModel(gltf, 25);
    model.traverse(function (obj) {
        if (obj.isMesh) {
            var mesh = obj;
            originalMaterials.set(mesh, mesh.material);
            mesh.material = new MeshBasicMaterial({
                color: 0x000000
            });
            // mesh.material = originalMaterials.get(mesh)!;
        }
    });
    model.traverse(function (obj) {
        obj.layers.set(1);
    });
    if (currentPokemon) {
        scene.remove(currentPokemon);
    }
    currentPokemon = model;
    scene.add(currentPokemon);
    // console.log("Model loaded:  " + currentPokemonName); // Triche
}
function loadData() {
    var idPokemon = randomPokemon();
    if (!idPokemon)
        return;
    currentPokemonName = idPokemon;
    new GLTFLoader()
        .setPath('/assets/Pokemon_models/' + idPokemon)
        .setResourcePath('/assets/Pokemon_models/' + idPokemon + '/images/')
        .load('/' + idPokemon.toLowerCase() + '.glb', gltfReader);
}
// Button to guess the right form #TODO: remplacer par les pokemons
function createButton(label, position) {
    var cube = new BoxGeometry(buttonSize, buttonSize, buttonSize);
    var material = new MeshPhongMaterial({ color: 0x808080 });
    var button = new Mesh(cube, material);
    button.name = label; // Set the name to identify the button
    button.position.set(position.x, position.y, position.z);
    return button;
}
// Buttons 
var button1 = createButton("Button1", { x: -23, y: -10, z: 25 });
var button2 = createButton("Button2", { x: -8, y: -10, z: 20 });
var button3 = createButton("Button3", { x: 8, y: -10, z: 20 });
var button4 = createButton("Button4", { x: 23, y: -10, z: 25 });
button1.rotateY(0.6);
button4.rotateY(-0.6);
var buttons = [button1, button2, button3, button4];
buttons.forEach(function (button) { return scene.add(button); });
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
    textMesh.position.x = centerOffset; // adjust horizontally
    textMesh.position.y = 0; // in front of the button
    textMesh.position.z = 4.3; // vertically
    return textMesh;
}
function addTextToButtons() {
    if (gameState != "playing")
        return;
    // console.log(currentPokemonName)
    var randomPokemonNames = [currentPokemonName];
    console.log(randomPokemonNames);
    while (randomPokemonNames.length < buttons.length) {
        var randomIndex = Math.floor(Math.random() * lstPokemon.length);
        var pokemonName = lstPokemon[randomIndex];
        if (!randomPokemonNames.includes(pokemonName) && pokemonName !== currentPokemonName) {
            randomPokemonNames.push(pokemonName);
        }
    }
    shuffle(randomPokemonNames);
    // console.log(randomPokemonNames)
    buttons.forEach(function (button, index) {
        button.name = randomPokemonNames[index]; // Set the button name to the Pokemon name for identification
        var textMesh = createTextMesh(randomPokemonNames[index], index);
        button.remove.apply(button, button.children); // Remove existing text if any
        // Attacher le texte au bouton
        button.add(textMesh);
    });
}
function shuffle(array) {
    var _a;
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [array[j], array[i]], array[i] = _a[0], array[j] = _a[1];
    }
    return array;
}
var timer = new Timer();
timer.connect(document);
// Main loop / render function
var animation = function () {
    renderer.setAnimationLoop(animation); // requestAnimationFrame() replacement, compatible with XR 
    timer.update();
    //const delta = timer.getDelta();
    var elapsed = timer.getElapsed();
    if (gameStarted && !infiniteMode) {
        var timeRemaining = gameDuration - elapsed;
        if (timeRemaining > 0)
            updateTimerDisplay(timeRemaining);
        else
            endGame();
    }
    if (currentPokemon) {
        currentPokemon.rotation.y = elapsed * 0.7;
    }
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
function try_onClick(event) {
    raycaster.setFromCamera(pointer, camera);
    var intersects = raycaster.intersectObjects(buttons, false);
    if (gameState === "menu") {
        if (intersects.length === 0)
            return;
        var clickedButton = intersects[0].object;
        if (clickedButton.name === "Jeu normal") {
            currentFilter = "all";
            answerDuration = 1000;
            infiniteMode = false;
            startGame();
        }
        if (clickedButton.name === "Nouveaux") {
            currentFilter = "new";
            answerDuration = 1000;
            infiniteMode = false;
            startGame();
        }
        if (clickedButton.name === "Anciens") {
            currentFilter = "old";
            answerDuration = 1000;
            infiniteMode = false;
            startGame();
        }
        else if (clickedButton.name === "Jeu infini") {
            currentFilter = "all";
            answerDuration = 2500;
            infiniteMode = true;
            startGame();
        }
        else {
            console.log("Mode pas encore implémenté");
        }
        return;
    }
    if (cdtBlock || !gameStarted)
        return;
    if (intersects.length > 0) {
        cdtBlock = true;
        var clickedButton = intersects[0].object;
        revealPokemon();
        if (currentPokemonName === clickedButton.name) {
            correctAnswer();
        }
        else
            wrongAnswer();
    }
}
function changeShape() {
    if (!currentPokemon)
        return;
    scene.remove(currentPokemon);
    loadData();
}
function convertGLTFModel(gltf, maxAllowedSize) {
    if (maxAllowedSize === void 0) { maxAllowedSize = 40; }
    var model = gltf.scene;
    var box = new Box3().setFromObject(model);
    var size = box.getSize(new Vector3());
    var center = box.getCenter(new Vector3());
    var maxAxis = Math.max(size.x, size.y, size.z);
    if (maxAxis > maxAllowedSize) {
        var scale = maxAllowedSize / maxAxis;
        model.scale.setScalar(scale);
    }
    box.setFromObject(model);
    var newCenter = box.getCenter(new Vector3());
    model.position.sub(newCenter);
    box.setFromObject(model);
    model.position.y -= box.min.y;
    return model;
}
function revealPokemon() {
    if (!currentPokemon)
        return;
    currentPokemon.traverse(function (obj) {
        var _a;
        if (obj.isMesh) {
            var mesh = obj;
            if (originalMaterials.has(mesh)) {
                var material = originalMaterials.get(mesh);
                if (!material)
                    return;
                if (Array.isArray(material)) {
                    mesh.material = material.map(function (mat) {
                        var _a;
                        return new MeshToonMaterial({
                            map: (_a = mat.map) !== null && _a !== void 0 ? _a : null,
                            color: 0xffffff,
                            gradientMap: toonGradient
                        });
                    });
                }
                else {
                    mesh.material = new MeshToonMaterial({
                        map: (_a = material.map) !== null && _a !== void 0 ? _a : null,
                        color: 0xffffff,
                        gradientMap: toonGradient
                    });
                }
            }
        }
    });
}
function correctAnswer() {
    score += 1;
    if (!lstPokemonFound.includes(currentPokemonName)) {
        lstPokemonFound.push(currentPokemonName);
    }
    updateScoreDisplay();
    flashLights(0x00ff00);
    // Allume les lumières en vert pendant 5 secondes
}
function wrongAnswer() {
    flashLights(0xff0000);
    //Allume les lumières en rouge pendant 5 secondes
}
function flashLights(color) {
    light.color.set(color);
    dirLight.color.set(color);
    hemiLight.color.set(color);
    setTimeout(function () {
        light.color.copy(originalAmbientColor);
        dirLight.color.copy(originalDirColor);
        hemiLight.color.copy(originalHemiSkyColor);
        hemiLight.groundColor.copy(originalHemiGroundColor);
        cdtBlock = false;
        nextPokemon();
    }, answerDuration);
}
function nextPokemon() {
    changeShape();
    addTextToButtons();
}
function updateScoreDisplay() {
    if (!font)
        return;
    if (scoreMesh)
        scene.remove(scoreMesh);
    var textGeo = new TextGeometry("Score: " + score, {
        font: font,
        size: 1.5,
        depth: 0.5,
        bevelEnabled: false
    });
    var textMaterial = new MeshPhongMaterial({ color: 0x4d7290 });
    scoreMesh = new Mesh(textGeo, textMaterial);
    scoreMesh.layers.set(1);
    scoreMesh.position.set(-30, 10, 20);
    scoreMesh.name = "Score";
    scoreMesh.rotateY(0.4);
    scene.add(scoreMesh);
}
function updateTimerDisplay(time) {
    if (gameState !== "playing")
        return;
    if (!font)
        return;
    if (timerMesh)
        scene.remove(timerMesh);
    var textGeo = new TextGeometry("Temps: " + Math.ceil(time), {
        font: font,
        size: 1.5,
        depth: 0.5,
        bevelEnabled: false
    });
    var textMaterial = new MeshPhongMaterial({ color: 0x000000 });
    timerMesh = new Mesh(textGeo, textMaterial);
    timerMesh.position.set(10, 20, 20);
    scene.add(timerMesh);
}
function endGame() {
    gameStarted = false;
    if (timerMesh)
        scene.remove(timerMesh);
    var textGeo = new TextGeometry("GAME OVER - Score: " + score, {
        font: font,
        size: 2,
        depth: 1,
        bevelEnabled: false
    });
    var textMaterial = new MeshPhongMaterial({ color: 0xff0000 });
    endMesh = new Mesh(textGeo, textMaterial);
    endMesh.position.set(-17.5, 0, 20);
    scene.add(endMesh);
    gameState = "gameover";
    setTimeout(function () {
        showMenu();
    }, 3000);
}
function showMenu() {
    gameState = "menu";
    camera.layers.disable(1);
    var menuOptions = [
        "Jeu normal",
        "Nouveaux",
        "Anciens",
        "Jeu infini",
    ];
    buttons.forEach(function (button, index) {
        button.name = menuOptions[index];
        var textMesh = createTextMesh(menuOptions[index], index);
        button.remove.apply(button, button.children);
        button.add(textMesh);
    });
}
function startGame() {
    if (endMesh)
        scene.remove(endMesh);
    if (infiniteMode && timerMesh)
        scene.remove(timerMesh);
    else if (!infiniteMode && timerMesh)
        timer = new Timer();
    gameState = "playing";
    gameStarted = true;
    score = 0;
    updateScoreDisplay();
    loadData();
    camera.layers.enable(1);
    timer.reset();
    addTextToButtons();
}
function availablePokemon() {
    if (currentFilter === "new") {
        return lstPokemon.filter(function (name) {
            return !lstPokemonFound.includes(name);
        });
    }
    if (currentFilter === "old") {
        return lstPokemon.filter(function (name) {
            return lstPokemonFound.includes(name);
        });
    }
    return lstPokemon;
}
// TODO demain faire les modes Tous pokemon et uniquement nouveaux
// Gérer liste si correcte et pas déjà eu bon alors ajouté à lstPokemonbon
// if NouveauxPokemon ajouter test dans le pokemon trié
document.addEventListener('click', try_onClick);
document.addEventListener('mousemove', onPointerMove);
//# sourceMappingURL=main.js.map