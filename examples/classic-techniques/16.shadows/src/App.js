import { useEffect, useRef } from 'react';
import { SphereGeometry, TextureLoader } from 'three';
import { PlaneGeometry } from 'three';
import { Mesh } from 'three';
import {
  MeshStandardMaterial,
  AmbientLight,
  DirectionalLight,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  // Clock,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as lil from 'lil-gui';
import { CameraHelper } from 'three';
import { SpotLight } from 'three';
import { MeshBasicMaterial } from 'three';
import { PlaneBufferGeometry } from 'three';
import { Clock } from 'three';

const renderer = (targetDom) => {
  const textureLoader = new TextureLoader();
  //const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg');
  const simplShadow = textureLoader.load('/textures/simpleShadow.jpg');

  // Debug
  const gui = new lil.GUI();

  // Scene
  const scene = new Scene();

  /**
   * Lights
   */
  // Ambient light
  const ambientLight = new AmbientLight(0xffffff, 0.5);
  gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);
  scene.add(ambientLight);

  // Directional light
  const directionalLight = new DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(2, 2, -1);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.top = 2;
  directionalLight.shadow.camera.right = 2;
  directionalLight.shadow.camera.bottom = -2;
  directionalLight.shadow.camera.left = -2;
  directionalLight.shadow.camera.far = 6;
  directionalLight.shadow.camera.radius = 10;
  scene.add(directionalLight);

  gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001);
  gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001);
  gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001);
  gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001);

  const directionalLightCameraHelper = new CameraHelper(
    directionalLight.shadow.camera
  );
  directionalLightCameraHelper.visible = false;
  scene.add(directionalLightCameraHelper);

  const spotLight = new SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3);
  spotLight.castShadow = true;
  spotLight.position.set(0, 2, 2);
  scene.add(spotLight);

  const spotLightHelper = new CameraHelper(spotLight.shadow.camera);
  spotLightHelper.visible = false;
  scene.add(spotLightHelper);

  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.camera.near = 0.1;
  spotLight.shadow.camera.far = 6;
  spotLight.shadow.camera.fov = 30;

  /**
   * Materials
   */
  const material = new MeshStandardMaterial();
  material.roughness = 0.7;
  gui.add(material, 'metalness').min(0).max(1).step(0.001);
  gui.add(material, 'roughness').min(0).max(1).step(0.001);

  /**
   * Objects
   */
  const sphere = new Mesh(new SphereGeometry(0.5, 32, 32), material);
  sphere.castShadow = true;

  const plane = new Mesh(new PlaneGeometry(5, 5), material);
  plane.rotation.x = -Math.PI * 0.5;
  plane.position.y = -0.5;
  plane.receiveShadow = true;

  scene.add(sphere, plane);

  const sphereShadow = new Mesh(
    new PlaneBufferGeometry(1.5, 1.5),
    new MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      alphaMap: simplShadow,
    })
  );
  sphereShadow.rotation.x = -Math.PI * 0.5;
  sphereShadow.position.y = plane.position.y + 0.01;
  scene.add(sphereShadow);

  /**
   * Sizes
   */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  /**
   * Camera
   */
  const camera = new PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.x = 1;
  camera.position.y = 1;
  camera.position.z = 2;
  scene.add(camera);

  // Controls
  const controls = new OrbitControls(camera, targetDom);
  controls.enableDamping = true;

  /**
   * Animate
   */
  const clock = new Clock();

  const animation = () => {
    const elapsedTime = clock.getElapsedTime();

    sphere.position.x = Math.cos(elapsedTime) * 1.5;
    sphere.position.z = Math.sin(elapsedTime) * 1.5;
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

    sphereShadow.position.x = Math.cos(elapsedTime) * 1.5;
    sphereShadow.position.z = Math.sin(elapsedTime) * 1.5;
    sphereShadow.material.opacity = (1 - sphere.position.y) * 0.5;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);
  };

  const renderer = new WebGLRenderer({ antialias: true });
  // renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animation);

  targetDom.appendChild(renderer.domElement);
};

function App() {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    renderer(ref.current);
  }, [ref]);

  return <div ref={ref} />;
}

export default App;
