import { useEffect, useRef } from "react";
import {
  Scene,
  BoxGeometry,
  Mesh,
  PerspectiveCamera,
  WebGLRenderer,
  MeshBasicMaterial,
  AxesHelper,
  Group
} from "three";

const renderer = (targetDom) => {
  // Objects
  const cube1 = new Mesh(
    new BoxGeometry(1, 1, 1),
    new MeshBasicMaterial({ color: 0xff0000 })
  );

  const cube2 = new Mesh(
    new BoxGeometry(1, 1, 1),
    new MeshBasicMaterial({ color: 0x00ff00 })
  );
  cube2.position.x = 2;

  const cube3 = new Mesh(
    new BoxGeometry(1, 1, 1),
    new MeshBasicMaterial({ color: 0x0000ff })
  );
  cube3.position.x = -2;

  const group = new Group();
  group.position.y = 1;
  group.scale.y = 2;
  group.rotation.y = 1;
  group.add(cube1);
  group.add(cube2);
  group.add(cube3);

  // Axes helper
  const axesHelper = new AxesHelper();

  // Camera
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight
  );
  camera.position.z = 3;
  camera.lookAt(group.position);

  const scene = new Scene();
  scene.add(axesHelper);
  scene.add(group);
  scene.add(camera);

  const animation = (time) => {
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
