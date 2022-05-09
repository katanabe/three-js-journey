import { useEffect, useRef } from 'react';
import { SphereGeometry } from 'three';
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

const renderer = (targetDom) => {
  /**
   * Base
   */
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
  gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001);
  gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001);
  gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001);
  gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001);
  scene.add(directionalLight);

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

  const plane = new Mesh(new PlaneGeometry(5, 5), material);
  plane.rotation.x = -Math.PI * 0.5;
  plane.position.y = -0.5;

  scene.add(sphere, plane);

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
  // Base camera
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
  // const clock = new Clock();

  const animation = () => {
    // const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);
  };

  const renderer = new WebGLRenderer({ antialias: true });
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
