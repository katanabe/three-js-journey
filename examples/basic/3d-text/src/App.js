import { useEffect, useRef } from 'react';
import {
  Scene,
  AxisHelper,
  Mesh,
  PerspectiveCamera,
  WebGLRenderer,
  MeshBasicMaterial,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

const renderer = (targetDom) => {
  let cursor = {
    x: 0,
    y: 0,
  };

  window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / window.innerWidth - 0.5;
    cursor.y = event.clientY / window.innerHeight - 0.5;
  });

  const fontLoader = new FontLoader();
  fontLoader.load('/fonts//helvetiker_regular.typeface.json', (font) => {
    console.log(font);

    const textGeometry = new TextGeometry('Hello three.js', {
      font,
      size: 0.5,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    });

    // textGeometry.computeBoundingBox();
    // textGeometry.translate(
    //   -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
    //   -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
    //   -(textGeometry.boundingBox.max.z - 0.03) * 0.5
    // );

    textGeometry.center();

    const textMaterial = new MeshBasicMaterial();
    textMaterial.wireframe = true;

    const text = new Mesh(textGeometry, textMaterial);
    scene.add(text);
  });

  // Camera
  const camera = new PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight
  );
  camera.position.z = 3;

  // Scene
  const scene = new Scene();
  scene.add(camera);

  const axisHelper = new AxisHelper();
  scene.add(axisHelper);

  const controls = new OrbitControls(camera, targetDom);
  controls.enableDamping = true;

  const animation = () => {
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
