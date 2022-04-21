import { useEffect, useRef } from 'react';
import { BufferGeometry } from 'three';
import { BufferAttribute } from 'three';
import {
  Scene,
  Mesh,
  PerspectiveCamera,
  WebGLRenderer,
  MeshBasicMaterial,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const renderer = (targetDom) => {
  let cursor = {
    x: 0,
    y: 0,
  };

  window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / window.innerWidth - 0.5;
    cursor.y = event.clientY / window.innerHeight - 0.5;
  });

  // Geometries
  // const positions = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0]);
  // const attributes = new BufferAttribute(positions, 3);
  // const geometry = new BufferGeometry();
  // geometry.setAttribute('position', attributes);

  const count = 5000;
  const positions = new Float32Array(count * 3 * 3);

  positions.forEach((_v, i) => {
    positions[i] = Math.random() - 0.5;
  });

  const attributes = new BufferAttribute(positions, 3);
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', attributes);

  // Objects
  const mesh = new Mesh(
    geometry,
    new MeshBasicMaterial({ color: 0xff0000, wireframe: true })
  );

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
