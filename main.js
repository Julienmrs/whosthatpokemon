"use strict";
// ⚠️ DO NOT EDIT main.js DIRECTLY ⚠️
// This file is generated from the TypeScript source main.ts
// Any changes made here will be overwritten.
// Import only what you need, to help your bundler optimize final code size using tree shaking
// see https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking)
import { PerspectiveCamera, Scene, WebGLRenderer, BoxGeometry, Mesh, MeshNormalMaterial, AmbientLight, Clock, MeshPhongMaterial, SphereGeometry, PointLight } from 'three';
// If you prefer to import the whole library, with the THREE prefix, use the following line instead:
// import * as THREE from 'three'
// NOTE: three/addons alias is supported by Rollup: you can use it interchangeably with three/examples/jsm/  
// Importing Ammo can be tricky.
// Vite supports webassembly: https://vitejs.dev/guide/features.html#webassembly
// so in theory this should work:
//
// import ammoinit from 'three/addons/libs/ammo.wasm.js?init';
// ammoinit().then((AmmoLib) => {
//  Ammo = AmmoLib.exports.Ammo()
// })
//
// But the Ammo lib bundled with the THREE js examples does not seem to export modules properly.
// A solution is to treat this library as a standalone file and copy it using 'vite-plugin-static-copy'.
// See vite.config.js
// 
// Consider using alternatives like Oimo or cannon-es
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// Example of hard link to official repo for data, if needed
// const MODEL_PATH = 'https://raw.githubusercontent.com/mrdoob/three.js/r173/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb';
// INSERT CODE HERE
var scene = new Scene();
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
var geometry = new BoxGeometry(1, 1, 1);
var material = new MeshNormalMaterial();
// an array of objects whose rotation to update
var objects = [];
// use just one sphere for everything
var radius = 5;
var widthSegments = 20;
var heightSegments = 20;
var sphereGeometry = new SphereGeometry(radius, widthSegments, heightSegments);
// const sunMaterial = new MeshPhongMaterial({ emissive: 0xFFFF00, wireframe: true });
var sunMaterial = new MeshNormalMaterial(
// { wireframe: true }
);
var sunGroup = new Mesh(sphereGeometry, sunMaterial);
scene.add(sunGroup);
objects.push(sunGroup);
var earthMaterial = new MeshPhongMaterial({ color: 0x2233FF, emissive: 0x112244 });
var earthGroup = new Mesh(sphereGeometry, earthMaterial);
earthGroup.scale.set(0.25, 0.25, 0.25);
earthGroup.position.x = 20;
sunGroup.add(earthGroup);
objects.push(earthGroup);
var moonMaterial = new MeshPhongMaterial({ color: 0x888888, emissive: 0x222222 });
var moonGroup = new Mesh(sphereGeometry, moonMaterial);
moonGroup.scale.set(0.25, 0.25, 0.25);
moonGroup.position.x = 8;
earthGroup.add(moonGroup);
objects.push(moonGroup);
{
    var color = 0xFFFFFF;
    var intensity = 500;
    var light_1 = new PointLight(color, intensity);
    scene.add(light_1);
}
var clock = new Clock();
// Main loop
var animation = function () {
    renderer.setAnimationLoop(animation); // requestAnimationFrame() replacement, compatible with XR 
    var delta = clock.getDelta();
    var elapsed = clock.getElapsedTime();
    // can be used in shaders: uniforms.u_time.value = elapsed;
    objects.forEach(function (obj) {
        obj.rotation.y = elapsed;
    });
    renderer.render(scene, camera);
};
animation();
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
//# sourceMappingURL=main.js.map