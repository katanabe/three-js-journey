import { useEffect, useRef } from 'react';
import {
  SphereBufferGeometry,
  Raycaster,
  Vector3,
  MeshBasicMaterial,
  Mesh,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Clock,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as lil from 'lil-gui';

const renderer = (targetDom) => {
  // Debug
  const gui = new lil.GUI();

  // Scene
  const scene = new Scene();

  /**
   * Materials
   */

  /**
   * Objects
   */
  const object1 = new Mesh(
    new SphereBufferGeometry(0.5, 16, 16),
    new MeshBasicMaterial({ color: '#ff0000' })
  );
  object1.position.x = -2;

  const object2 = new Mesh(
    new SphereBufferGeometry(0.5, 16, 16),
    new MeshBasicMaterial({ color: '#ff0000' })
  );

  const object3 = new Mesh(
    new SphereBufferGeometry(0.5, 16, 16),
    new MeshBasicMaterial({ color: '#ff0000' })
  );
  object3.position.x = 2;

  scene.add(object1, object2, object3);

  const raycaster = new Raycaster();
  const rayOrigin = new Vector3(-3, 0, 0);
  const rayDirection = new Vector3(10, 0, 0);
  rayDirection.normalize();

  raycaster.set(rayOrigin, rayDirection);

  const intersect = raycaster.intersectObject(object2);
  console.log(intersect);

  const intersects = raycaster.intersectObjects([object1, object2, object3]);
  console.log(intersects);

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
    const elapsedTime = clock.getElapsedTime();

    object1.position.y = Math.sin(elapsedTime);

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
