import { useEffect, useRef } from 'react';
import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';

const renderer = (targetDom) => {
  // Camera
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight
  );
  camera.position.z = 3;

  const scene = new Scene();
  scene.add(camera);

  const animation = (_time) => {
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
