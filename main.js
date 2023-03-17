import './style.css'

// document.querySelector('#app').innerHTML = `
//   <h1>Hello Vite!</h1>
//   <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
// `

import * as THREE from 'three';
import { GridHelper, Mesh, PointLightHelper } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1,1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

const planetsTextures = [
  {
    planet: 'earth',
    texture: new THREE.TextureLoader().load('planetTextures/2k_earth_daymap.jpg'),
    radius: 4
  },
  {
    planet: 'jupiter',
    texture: new THREE.TextureLoader().load('planetTextures/2k_jupiter.jpg'),
    radius: 10
  },
  {
    planet: 'mars',
    texture: new THREE.TextureLoader().load('planetTextures/2k_mars.jpg'),
    radius: 3
  },
  {
    planet: 'mercury',
    texture: new THREE.TextureLoader().load('planetTextures/2k_mercury.jpg'),
    radius: 2
  },
  {
    planet: 'uranus',
    texture: new THREE.TextureLoader().load('planetTextures/2k_uranus.jpg'),
    radius: 6
  },
  {
    planet: 'venus',
    texture: new THREE.TextureLoader().load('planetTextures/2k_venus_atmosphere.jpg'),
    radius: 4
  },
]

const planets = []

const geometry = new THREE.TorusGeometry(10,3,16,100);
const material = new THREE.MeshStandardMaterial({color: 0xFF6562});
const torus = new THREE.Mesh(geometry,material);
//scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(10,10,900);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xcccccc);
//scene.add(ambientLight);

const lightHelper = new PointLightHelper(pointLight);
const gridHelper = new GridHelper(200,50);
//scene.add(lightHelper,gridHelper);

//const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25,24,24);
  const material = new THREE.MeshStandardMaterial({color:0xffffff});
  const star = new THREE.Mesh(geometry,material);

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(1000));
  star.position.set(x,y,z);
  scene.add(star);
}

Array(9000).fill().forEach(addStar);

function addPlanet(name,radius, texture) {
  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 33,33),
    new THREE.MeshStandardMaterial({
      map:texture
    })
  );
  planets.push({name:name, planet: planet});

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(400));
  planet.position.set(x,y,z);
  scene.add(planet);
}

planetsTextures.forEach((planet) => {
  addPlanet(planet.name,planet.radius,planet.texture);
})

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(100, 30, 30),
  new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('planetTextures/2k_sun.jpg')
  })
)
sun.position.set(10,10,900);
scene.add(sun)

const spaceTexture = new THREE.TextureLoader().load('spaceBlack.jpg');
spaceTexture.minFilter = THREE.LinearFilter;
scene.background = spaceTexture;

const puppTexture = new THREE.TextureLoader().load('puppbro.jpg');
const puppy = new THREE.Mesh(
  new THREE.SphereGeometry(3,33,33),
  new THREE.MeshStandardMaterial({map:puppTexture})
  
);
const[x,y,z] = Array(3).fill().map(()=> THREE.MathUtils.randFloatSpread(300))
puppy.position.set(x,y,z);
scene.add(puppy);

const moonTexture = new THREE.TextureLoader().load('moon_txt.jpg');
const moonNormalTexture = new THREE.TextureLoader().load('moon_normal_txt.jpg');
const moon = new Mesh(
  new THREE.SphereGeometry(0.3,24,24),
  new THREE.MeshStandardMaterial({
    map:moonTexture,
    normalMap:moonNormalTexture
  })
);
moon.position.setZ(27);
moon.position.setY(-1);
scene.add(moon);

document.addEventListener("keydown",moveCamera);

function moveCamera(event) {
  var keycode = event.keyCode;
  switch(keycode) {
    case 37 : camera.position.x -= 0.5;
    moon.position.x -= 0.5
    break;
    case 38 : camera.position.z -=0.5;
    moon.position.z -=0.5
    break;
    case 39 : camera.position.x +=0.5;
    moon.position.x +=0.5
    break;
    case 40 : camera.position.z +=0.5
    moon.position.z +=0.5
    break;
    case 87 : camera.position.y +=0.3;
    moon.position.y += 0.3;
    break;
    case 83 : camera.position.y -=0.3;
    moon.position.y -=0.3;
    break;
    default: break;
  }
}

function animate() {
  requestAnimationFrame(animate);
  // torus.rotation.x += 0.01;
  // torus.rotation.y += 0.005;
  // torus.rotation.z += 0.01;
  planets.forEach((pl) => {
    pl.planet.rotation.y +=0.005;
  })
  moon.rotation.y +=0.025;
  puppy.rotation.y +=0.005;
  sun.rotation.y +=0.005;
  renderer.render(scene,camera);
}

animate();