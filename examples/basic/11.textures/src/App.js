import { useEffect, useRef } from 'react';
import { TextureLoader } from 'three';
import { BoxBufferGeometry } from 'three';
import { NearestFilter } from 'three';
import { LoadingManager } from 'three';
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

  // Objects

  const loadingManager = new LoadingManager();
  const textureLoader = new TextureLoader(loadingManager);
  // const alphaTexure = loadingManager.load('/assets/door/alpha.jpg');
  // const ambientOcclusionTexure = loadingManager.load(
  //   '/assets/door/ambientOcclusion.jpg'
  // );
  // const colorTexure = textureLoader.load('/assets/door/color.jpg');
  const colorTexure = textureLoader.load('/assets/minecraft.png');
  // const colorTexure = textureLoader.load('/assets/checkerboard-1024x1024.png');
  // const heightTexure = loadingManager.load('/assets/door/height.jpg');
  // const metalnessTexure = loadingManager.load('/assets/door/metalness.jpg');
  // const normalTexure = loadingManager.load('/assets/door/normal.jpg');
  // const roughnessTexure = loadingManager.load('/assets/door/roughness.jpg');

  // colorTexure.rotation = Math.PI * 0.25;
  // colorTexure.center.x = 0.5;
  // colorTexure.center.y = 0.5;
  colorTexure.minFilter = NearestFilter;
  colorTexure.magFilter = NearestFilter;

  const geometry = new BoxBufferGeometry(1, 1, 1);

  const mesh = new Mesh(geometry, new MeshBasicMaterial({ map: colorTexure }));

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
  // controls.enabled = false;
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

  window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / window.innerWidth - 0.5;
    cursor.y = event.clientY / window.innerHeight - 0.5;
  });

  window.addEventListener('resize', (event) => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // update camer
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  window.addEventListener('dblclick', () => {
    if (window.document.fullscreenEnabled) {
      renderer.domElement.requestFullscreen();
    } else {
      renderer.domElement.exitFullscreen();
    }
  });
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
