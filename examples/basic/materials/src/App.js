import { useEffect, useRef } from 'react';
import {
  PointLight,
  BufferAttribute,
  MeshStandardMaterial,
  AmbientLight,
  Clock,
  TextureLoader,
  PlaneBufferGeometry,
  TorusBufferGeometry,
  SphereBufferGeometry,
  Scene,
  Mesh,
  PerspectiveCamera,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as lil from 'lil-gui';
import { CubeTextureLoader } from 'three';

const gui = new lil.GUI();

const renderDebugUI = (material) => {
  if (material) {
    gui.add(material, 'metalness').min(0).max(1).step(0.0001);
    gui.add(material, 'roughness').min(0).max(1).step(0.0001);
    gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.0001);
    gui.add(material, 'displacementScale').min(0).max(1).step(0.0001);
  }
};

const renderer = (targetDom) => {
  let cursor = {
    x: 0,
    y: 0,
  };

  window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / window.innerWidth - 0.5;
    cursor.y = event.clientY / window.innerHeight - 0.5;
  });

  // Scene
  const scene = new Scene();

  // Texture
  // const textureLoader = new TextureLoader();
  // const matcapTexture = textureLoader.load('/assets/matcaps/1.png');
  // const matcapTexture = textureLoader.load('/assets/matcaps/2.png');
  // const matcapTexture = textureLoader.load('/assets/matcaps/3.png');
  // const matcapTexture = textureLoader.load('/assets/matcaps/4.png');
  // const matcapTexture = textureLoader.load('/assets/matcaps/5.png');
  // const matcapTexture = textureLoader.load('/assets/matcaps/6.png');
  // const matcapTexture = textureLoader.load('/assets/matcaps/7.png');
  // const matcapTexture = textureLoader.load('/assets/matcaps/8.png');

  // const textureLoader = new TextureLoader();
  // const alphaTexture = textureLoader.load('/assets/door/alpha.jpg');
  // const ambientOcclusionTexure = textureLoader.load(
  //   '/assets/door/ambientOcclusion.jpg'
  // );
  // const colorTexure = textureLoader.load('/assets/door/color.jpg');
  // const heightTexure = textureLoader.load('/assets/door/height.jpg');
  // const metalnessTexure = textureLoader.load('/assets/door/metalness.jpg');
  // const normalTexure = textureLoader.load('/assets/door/normal.jpg');
  // const roughnessTexure = textureLoader.load('/assets/door/roughness.jpg');

  // const gradiantTexure = textureLoader.load('/assets/gradients/5.jpg');
  // gradiantTexure.minFilter = NearestFilter;
  // gradiantTexure.magFilter = NearestFilter;
  // gradiantTexure.generateMipmaps = false;

  const texureCode = 'custom';
  const cubeTexureLoader = new CubeTextureLoader();
  const enviromentMapTexure = cubeTexureLoader.load([
    `/assets/environmentMaps/${texureCode}/px.png`,
    `/assets/environmentMaps/${texureCode}/nx.png`,
    `/assets/environmentMaps/${texureCode}/py.png`,
    `/assets/environmentMaps/${texureCode}/ny.png`,
    `/assets/environmentMaps/${texureCode}/pz.png`,
    `/assets/environmentMaps/${texureCode}/nz.png`,
  ]);

  // Objects
  // const material = new MeshBasicMaterial();
  // material.map = colorTexure;
  // material.transparent = true;
  // material.alphaMap = alphaTexture;

  // const material = new MeshNormalMaterial();
  // material.wireframe = true;
  // material.flatShading = true;

  // const material = new MeshMatcapMaterial();
  // material.matcap = matcapTexture;

  // const material = new MeshLambertMaterial();
  // const material = new MeshLambertMaterial();

  // const material = new MeshPhongMaterial();
  // material.shininess = 100;
  // material.specular = new Color(0x1188ff);

  // const material = new MeshToonMaterial();
  // material.gradientMap = gradiantTexure;

  // const material = new MeshStandardMaterial();
  // material.metalness = 0.5;
  // material.roughness = 0.65;
  // material.map = colorTexure;
  // material.aoMap = ambientOcclusionTexure;
  // material.displacementMap = heightTexure;
  // material.displacementScale = 0.1;
  // material.metalnessMap = metalnessTexure;
  // material.roughnessMap = roughnessTexure;
  // material.normalMap = normalTexure;
  // material.normalScale.set(0.5, 0.5);
  // material.transparent = true;
  // material.alphaMap = alphaTexture;

  const material = new MeshStandardMaterial();
  material.metalness = 0.7;
  material.roughness = 0.2;
  material.envMap = enviromentMapTexure;

  const sphere = new Mesh(new SphereBufferGeometry(0.5, 64, 64), material);
  sphere.position.x = -1.5;
  sphere.geometry.setAttribute(
    'uv2',
    new BufferAttribute(sphere.geometry.attributes.uv.array, 2)
  );

  const plane = new Mesh(new PlaneBufferGeometry(1, 1, 100, 100), material);
  plane.geometry.setAttribute(
    'uv2',
    new BufferAttribute(plane.geometry.attributes.uv.array, 2)
  );

  const torus = new Mesh(new TorusBufferGeometry(0.3, 0.2, 64, 128), material);
  torus.position.x = 1.5;
  torus.geometry.setAttribute(
    'uv2',
    new BufferAttribute(torus.geometry.attributes.uv.array, 2)
  );

  scene.add(sphere, plane, torus);

  // Camera
  const camera = new PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 3;
  scene.add(camera);

  // light
  const ambientLight = new AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  const pointLight = new PointLight(0xffffff, 0.5);
  pointLight.position.x = 2;
  pointLight.position.y = 3;
  pointLight.position.z = 4;
  scene.add(pointLight);

  const controls = new OrbitControls(camera, targetDom);
  controls.enableDamping = true;

  const clock = new Clock();

  const animation = () => {
    const elapsedTime = clock.getElapsedTime();

    sphere.rotation.y = 0.1 * elapsedTime;
    plane.rotation.y = 0.1 * elapsedTime;
    torus.rotation.y = 0.1 * elapsedTime;

    sphere.rotation.x = 0.15 * elapsedTime;
    plane.rotation.x = 0.15 * elapsedTime;
    torus.rotation.x = 0.15 * elapsedTime;

    controls.update();

    renderer.render(scene, camera);
  };

  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animation);

  targetDom.appendChild(renderer.domElement);

  renderDebugUI(material);
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
