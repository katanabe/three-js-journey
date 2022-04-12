import { useEffect, useRef } from 'react';
import './App.css';
import {
  Scene,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  PerspectiveCamera,
  WebGLRenderer,
} from 'three';

const renderer = (ref) => {
  const sizes = {
    width: 800,
    height: 600,
  };

  const scene = new Scene();

  const cubeGeometry = new BoxGeometry(1, 1, 1);
  const cubeMaterial = new MeshBasicMaterial({
    color: '#ff0000',
  });
  const cubeMesh = new Mesh(cubeGeometry, cubeMaterial);
  scene.add(cubeMesh);

  const camera = new PerspectiveCamera(75, sizes.width / sizes.height);
  camera.position.z = 3;
  scene.add(camera);

  const renderer = new WebGLRenderer({
    canvas: ref.current,
  });
  renderer.setSize(sizes.width, sizes.height);

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();
};

function App() {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const canvas = ref.current;
    const context = canvas.getContext('2d');
    console.log(context);

    context.strokeStyle = '#000000'; // 矩形色
    context.lineWidth = 2; // 矩形線幅
    context.strokeRect(100, 100, 100, 100); // 矩形描画

    renderer(ref.current);
  }, [ref]);

  return <canvas ref={ref} style={{ width: '100%', height: '100%' }} />;
}

export default App;
