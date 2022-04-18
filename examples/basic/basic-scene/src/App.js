import { useEffect, useRef } from 'react';
import './App.css';
import {
  Scene,
  BoxGeometry,
  Mesh,
  PerspectiveCamera,
  WebGLRenderer,
  MeshNormalMaterial,
} from 'three';

const renderer = (targetDom) => {
  const camera = new PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    10
  );
  camera.position.z = 1;

  const scene = new Scene();

  const geometry = new BoxGeometry(0.2, 0.2, 0.2);
  const material = new MeshNormalMaterial();

  const mesh = new Mesh(geometry, material);
  scene.add(mesh);

  const animation = (time) => {
    mesh.rotation.x = time / 2000;
    mesh.rotation.y = time / 1000;

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
