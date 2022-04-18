import { useEffect, useRef } from 'react';
import './App.css';
import {
  Scene,
  BoxGeometry,
  Mesh,
  PerspectiveCamera,
  WebGLRenderer,
  MeshBasicMaterial,
  Clock,
} from 'three';
import gsap from 'gsap';

const renderer = (targetDom) => {
  console.log(gsap);

  // Objects
  const mesh = new Mesh(
    new BoxGeometry(1, 1, 1),
    new MeshBasicMaterial({ color: 0xff0000 })
  );

  // Camera
  const camera = new PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight
  );
  camera.position.z = 3;

  // Clock
  // const clock = new Clock();

  // Scene
  const scene = new Scene();
  scene.add(mesh);
  scene.add(camera);

  gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });
  gsap.to(mesh.position, { duration: 1, delay: 2, x: 0 });

  const animation = () => {
    // const elapsedTime = clock.getElapsedTime();
    // camera.position.y = Math.sin(elapsedTime);
    // camera.position.x = Math.cos(elapsedTime);
    // camera.lookAt(mesh.position);

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
