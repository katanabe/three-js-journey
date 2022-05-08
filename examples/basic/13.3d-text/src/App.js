import { useEffect, useRef } from 'react';
import {
  Scene,
  AxisHelper,
  Mesh,
  PerspectiveCamera,
  WebGLRenderer,
  TextureLoader,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { TorusBufferGeometry, MeshMatcapMaterial } from 'three';

const renderer = (targetDom) => {
  let cursor = {
    x: 0,
    y: 0,
  };

  window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / window.innerWidth - 0.5;
    cursor.y = event.clientY / window.innerHeight - 0.5;
  });

  const texureLoader = new TextureLoader();
  // const matcapTexure = texureLoader.load('/textures/matcaps/1.png');

  // const matcapTexure = texureLoader.load('/textures/matcaps/2.png');
  // const matcapTexure = texureLoader.load('/textures/matcaps/3.png');
  // const matcapTexure = teureLoadetexr.load('/textures/matcaps/4.png');
  // const matcapTexure = texureLoader.load('/textures/matcaps/5.png');
  // const matcapTexure = texureLoader.load('/textures/matcaps/6.png');
  // const matcapTexure =  texureLoader.load('/textures/matcaps/7.png');
  const matcapTexure = texureLoader.load('/textures/matcaps/8.png');

  const fontLoader = new FontLoader();
  fontLoader.load('/fonts//helvetiker_regular.typeface.json', (font) => {
    console.log(font);

    const textGeometry = new TextGeometry('Hello three.js', {
      font,
      size: 0.5,
      height: 0.2,
      curveSegments: 7,
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

    // const donutGeometry = new TorusBufferGeometry(0.3, 0.2, 20, 45);
    const textMaterial = new MeshMatcapMaterial({ matcap: matcapTexure });
    const text = new Mesh(textGeometry, textMaterial);
    scene.add(text);

    console.time('donuts');

    const donutsGeometry = new TorusBufferGeometry(0.3, 0.2, 30, 45);
    const donutsMaterial = new MeshMatcapMaterial({
      matcap: matcapTexure,
    });

    for (let i = 0; i < 1000; i++) {
      const donuts = new Mesh(donutsGeometry, donutsMaterial);
      donuts.position.x = (Math.random() - 0.5) * 10;
      donuts.position.y = (Math.random() - 0.5) * 10;
      donuts.position.z = (Math.random() - 0.5) * 10;

      donuts.rotation.x = Math.random() * Math.PI;
      donuts.rotation.y = Math.random() * Math.PI;

      const scale = Math.random();
      donuts.scale.set(scale, scale, scale);

      scene.add(donuts);
    }

    console.timeEnd('donuts');
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
