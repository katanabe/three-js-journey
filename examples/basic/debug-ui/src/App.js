import { useEffect, useRef } from 'react';
import {
  Scene,
  BoxGeometry,
  Mesh,
  PerspectiveCamera,
  WebGLRenderer,
  MeshBasicMaterial,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'lil-gui';
import gsap from 'gsap';

const gui = new GUI();
gui.close();

const spin = (mesh) => {
  return () => {
    gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + 10 });
  };
};

const materialOption = {
  color: '#ff0000',
};

const renderDebugUI = (mesh, material) => {
  if (mesh) {
    gui.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('elevation');
    gui.add(mesh, 'visible');
    gui.add({ spin: spin(mesh) }, 'spin');
  }

  if (material) {
    gui.add(material, 'wireframe');
    gui.addColor(materialOption, 'color').onChange((value) => {
      material.color.set(value);
    });
  }
};

const renderer = (targetDom) => {
  let cursor = {
    x: 0,
    y: 0,
  };

  window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / window.innerWidth - 0.5;
    cursor.y = event.clientY / window.innerHeight - 0.5;
  });

  // Objects
  const material = new MeshBasicMaterial(materialOption);

  const mesh = new Mesh(new BoxGeometry(1, 1, 1), material);

  // Camera
  const camera = new PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 3;

  // Clock
  // const clock = new Clock();

  // Scene
  const scene = new Scene();
  scene.add(mesh);
  scene.add(camera);

  const controls = new OrbitControls(camera, targetDom);
  controls.enableDamping = true;

  const animation = () => {
    // const elapsedTime = clock.getElapsedTime();

    // Update camera
    // camera.position.x = Math.cos(cursor.x * Math.PI * 2) * 3;
    // camera.position.y = cursor.y * 5;
    // camera.position.z = Math.sin(cursor.x * Math.PI * 2) * 3;
    // // camera.position.x = Math.cos(elapsedTime);
    // camera.lookAt(mesh.position);

    controls.update();

    renderer.render(scene, camera);
  };

  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animation);
  targetDom.appendChild(renderer.domElement);

  renderDebugUI(mesh, material);
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
