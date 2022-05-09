import { useEffect, useRef } from 'react';
import {
  SpotLight,
  HemisphereLightHelper,
  PointLightHelper,
  SpotLightHelper,
  DirectionalLightHelper,
  Clock,
  RectAreaLight,
  PointLight,
  HemisphereLight,
  AmbientLight,
  SphereGeometry,
  Mesh,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  MeshStandardMaterial,
  BoxGeometry,
  PlaneGeometry,
  DirectionalLight,
  TorusGeometry,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';

const renderer = (targetDom) => {
  const scene = new Scene();

  // Light
  const ambientLight = new AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new DirectionalLight(0x00fffc, 0.3);
  directionalLight.position.set(1, 0.25, 0);
  scene.add(directionalLight);

  const hemisphereLight = new HemisphereLight(0xff0000, 0x0000ff, 0.3);
  scene.add(hemisphereLight);

  const pointLight = new PointLight(0xff9900, 0.5, 3);
  pointLight.position.set(1, -0.5, 1);
  scene.add(pointLight);

  const rectAreaLight = new RectAreaLight(0x4e00ff, 2, 1, 1);
  rectAreaLight.position.set(-1.5, 0, 1.5);
  scene.add(rectAreaLight);

  const spotLight = new SpotLight(0x78ff00, 0.5, 6, Math.PI * 0.1, 0.25, 1);
  spotLight.position.set(0, 2, 3);
  scene.add(spotLight);

  // Helpers

  const hemisphereLightHelper = new HemisphereLightHelper(hemisphereLight, 0.2);
  scene.add(hemisphereLightHelper);

  const directionalLightHelper = new DirectionalLightHelper(
    directionalLight,
    0.2
  );
  scene.add(directionalLightHelper);

  const pointLightHelper = new PointLightHelper(pointLight, 0.2);
  scene.add(pointLightHelper);

  const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight, 0.2);
  scene.add(rectAreaLightHelper);

  const spotLightHelper = new SpotLightHelper(spotLight, 0.2);
  scene.add(spotLightHelper);

  // Materials
  const material = new MeshStandardMaterial();

  const sphere = new Mesh(new SphereGeometry(0.5, 32, 32), material);
  sphere.position.x = -1.5;
  scene.add(sphere);

  const cube = new Mesh(new BoxGeometry(0.75, 0.75, 0.75), material);
  scene.add(cube);

  const torus = new Mesh(new TorusGeometry(0.3, 0.2, 32, 64), material);
  torus.position.x = 1.5;
  scene.add(torus);

  const plane = new Mesh(new PlaneGeometry(5, 5), material);
  plane.rotation.x = -Math.PI * 0.5;
  plane.position.y = -0.65;
  scene.add(plane);

  // Camera
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight
  );
  camera.position.x = 1;
  camera.position.y = 1;
  camera.position.z = 2;

  // Controls
  const controls = new OrbitControls(camera, targetDom);
  controls.enableDamping = true;

  scene.add(camera);

  const clock = new Clock();

  const animation = () => {
    const elapsedTime = clock.getElapsedTime();

    sphere.rotation.y = 0.1 * elapsedTime;
    cube.rotation.y = 0.1 * elapsedTime;
    torus.rotation.y = 0.1 * elapsedTime;

    sphere.rotation.x = 0.15 * elapsedTime;
    cube.rotation.x = 0.15 * elapsedTime;
    torus.rotation.x = 0.15 * elapsedTime;

    spotLightHelper.update();
    controls.update();

    renderer.render(scene, camera);
  };

  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animation);

  targetDom.appendChild(renderer.domElement);

  let sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
