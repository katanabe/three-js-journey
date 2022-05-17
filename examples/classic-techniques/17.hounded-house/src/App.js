import { useEffect, useRef } from 'react';
import { PlaneGeometry } from 'three';
import { Mesh } from 'three';
import { Scene, PerspectiveCamera, WebGLRenderer, Clock } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as lil from 'lil-gui';
import { MeshStandardMaterial } from 'three';
import { AmbientLight } from 'three';
import { DirectionalLight } from 'three';
import { Group } from 'three';

const renderer = (targetDom) => {
  // Debug
  const gui = new lil.GUI();

  // Scene
  const scene = new Scene();

  /**
   * Materials
   */
  const material = new MeshStandardMaterial({ color: '#a9c388' });

  /**
   * Objects
   */

  const plane = new Mesh(new PlaneGeometry(5, 5), material);
  plane.rotation.x = -Math.PI * 0.5;
  plane.position.y = -1;

  scene.add(plane);

  const house = new Group();
  scene.add(house);

  /**
   * Lights
   */

  // Ambient light
  const ambientLight = new AmbientLight('#ffffff', 0.5);
  gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);
  scene.add(ambientLight);

  // Directional light
  const moonLight = new DirectionalLight('#ffffff', 0.5);
  moonLight.position.set(4, 5, -2);
  gui.add(moonLight, 'intensity').min(0).max(1).step(0.001);
  gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001);
  gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001);
  gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001);
  scene.add(moonLight);

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
