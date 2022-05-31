import { useEffect, useRef } from 'react';
import {
  PlaneGeometry,
  BoxBufferGeometry,
  PlaneBufferGeometry,
  DirectionalLight,
  AmbientLight,
  SphereBufferGeometry,
  ConeBufferGeometry,
  MeshStandardMaterial,
  Group,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Clock,
  Mesh,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as lil from 'lil-gui';
import { PointLight, TextureLoader } from 'three';
import { Fog } from 'three';
import { Float32BufferAttribute } from 'three';
import { RepeatWrapping } from 'three';
import { PCFSoftShadowMap } from 'three';

const renderer = (targetDom) => {
  // Debug
  const gui = new lil.GUI();

  // Scene
  const scene = new Scene();

  // Fog
  const fog = new Fog('#262837', 1, 15);
  scene.fog = fog;

  // Texture
  const textureLoader = new TextureLoader();
  const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
  const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
  const doorAmbientTexture = textureLoader.load(
    '/textures/door/ambientOcclusion.jpg'
  );
  const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
  const doorMetalnessTexture = textureLoader.load(
    '/textures/door/metalness.jpg'
  );
  const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
  const doorRoughnessTexture = textureLoader.load(
    '/textures/door/roughness.jpg'
  );

  const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg');
  const bricksAmbientTexture = textureLoader.load(
    '/textures/bricks/ambientOcclusion.jpg'
  );
  const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg');
  const bricksRoughnessTexture = textureLoader.load(
    '/textures/bricks/roughness.jpg'
  );

  const grassColorTexture = textureLoader.load('/textures/grass/color.jpg');
  const grassAmbientTexture = textureLoader.load(
    '/textures/grass/ambientOcclusion.jpg'
  );
  const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg');
  const grassRoughnessTexture = textureLoader.load(
    '/textures/grass/roughness.jpg'
  );

  grassColorTexture.repeat.set(8, 8);
  grassAmbientTexture.repeat.set(8, 8);
  grassNormalTexture.repeat.set(8, 8);
  grassRoughnessTexture.repeat.set(8, 8);

  grassColorTexture.wrapS = RepeatWrapping;
  grassAmbientTexture.wrapS = RepeatWrapping;
  grassNormalTexture.wrapS = RepeatWrapping;
  grassRoughnessTexture.wrapS = RepeatWrapping;

  grassColorTexture.wrapT = RepeatWrapping;
  grassAmbientTexture.wrapT = RepeatWrapping;
  grassNormalTexture.wrapT = RepeatWrapping;
  grassRoughnessTexture.wrapT = RepeatWrapping;

  /**
   * Objects
   */

  const house = new Group();
  scene.add(house);

  const walls = new Mesh(
    new BoxBufferGeometry(4, 2.5, 4),
    new MeshStandardMaterial({
      map: bricksColorTexture,
      aoMap: bricksAmbientTexture,
      normalMap: bricksNormalTexture,
      roughnessMap: bricksRoughnessTexture,
    })
  );
  walls.geometry.setAttribute(
    'uv2',
    new Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
  );

  walls.position.y = 1.25;
  house.add(walls);

  const roof = new Mesh(
    new ConeBufferGeometry(3.5, 1, 4),
    new MeshStandardMaterial({ color: '#333333' })
  );
  roof.position.y = 3;
  roof.rotation.y = Math.PI * 0.25;
  house.add(roof);

  const door = new Mesh(
    new PlaneBufferGeometry(2.2, 2.2, 100, 100),
    new MeshStandardMaterial({
      map: doorColorTexture,
      transparent: true,
      alphaMap: doorAlphaTexture,
      aoMap: doorAmbientTexture,
      displacementMap: doorHeightTexture,
      displacementScale: 0.1,
      normalMap: doorNormalTexture,
      metalnessMap: doorMetalnessTexture,
      roughnessMap: doorRoughnessTexture,
    })
  );
  door.geometry.setAttribute(
    'uv2',
    new Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
  );

  door.position.y = 1;
  door.position.z = 2.001;
  house.add(door);

  const bushGeometry = new SphereBufferGeometry();
  const bushMaterial = new MeshStandardMaterial({ color: '#89c854' });

  const bush1 = new Mesh(bushGeometry, bushMaterial);
  bush1.scale.set(0.5, 0.5, 0.5);
  bush1.position.set(0.8, 0.2, 2.1);

  const bush2 = new Mesh(bushGeometry, bushMaterial);
  bush2.scale.set(0.25, 0.25, 0.25);
  bush2.position.set(1.4, 0.1, 2.1);

  const bush3 = new Mesh(bushGeometry, bushMaterial);
  bush3.scale.set(0.4, 0.4, 0.4);
  bush3.position.set(-0.8, 0.1, 2.2);

  const bush4 = new Mesh(bushGeometry, bushMaterial);
  bush4.scale.set(0.15, 0.15, 0.15);
  bush4.position.set(-1, 0.05, 2.6);

  house.add(bush1, bush2, bush3, bush4);

  const graveGeometry = new BoxBufferGeometry(0.6, 0.8, 0.2);
  const graveMaterial = new MeshStandardMaterial({ color: '#b2b6b1' });

  const graves = new Group();
  scene.add(graves);

  for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 6;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;

    const grave = new Mesh(graveGeometry, graveMaterial);
    grave.position.set(x, 0.3, z);
    grave.rotation.y = (Math.random() - 0.5) * 0.4;
    grave.rotation.z = (Math.random() - 0.5) * 0.4;
    grave.castShadow = true;
    graves.add(grave);
  }

  const floor = new Mesh(
    new PlaneGeometry(20, 20),
    new MeshStandardMaterial({
      map: grassColorTexture,
      aoMap: grassAmbientTexture,
      normalMap: grassNormalTexture,
      roughnessMap: grassRoughnessTexture,
    })
  );
  floor.rotation.x = -Math.PI * 0.5;
  floor.receiveShadow = true;

  house.add(floor);

  /**
   * Lights
   */

  // Ambient light
  const ambientLight = new AmbientLight('#b9d5ff', 0.12);
  gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);
  scene.add(ambientLight);

  // Directional light
  const moonLight = new DirectionalLight('#b9d5ff', 0.12);
  moonLight.position.set(4, 5, -2);
  gui.add(moonLight, 'intensity').min(0).max(1).step(0.001);
  gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001);
  gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001);
  gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001);
  scene.add(moonLight);

  const doorLight = new PointLight('#ff7d46', 1, 7);
  doorLight.position.set(0, 2.2, 2.7);
  scene.add(doorLight);

  const ghost1 = new PointLight('#ff00ff', 2, 3);
  scene.add(ghost1);

  const ghost2 = new PointLight('#00ffff', 2, 3);
  scene.add(ghost2);

  const ghost3 = new PointLight('#ffff00', 2, 3);
  scene.add(ghost3);

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

    // Update ghost
    const ghost1Angle = elapsedTime * 0.5;
    ghost1.position.x = Math.cos(ghost1Angle) * 4;
    ghost1.position.z = Math.sin(ghost1Angle) * 4;
    ghost1.position.y = Math.sin(ghost1Angle * 3);

    const ghost2Angle = -elapsedTime * 0.32;
    ghost2.position.x = Math.cos(ghost2Angle) * 5;
    ghost2.position.z = Math.sin(ghost2Angle) * 5;
    ghost2.position.y = Math.sin(ghost2Angle * 5) + Math.sin(elapsedTime * 2.5);

    const ghost3Angle = -elapsedTime * 0.18;
    ghost3.position.x =
      Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
    ghost3.position.z =
      Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
    ghost3.position.y = Math.sin(ghost3Angle * 4) + Math.sin(elapsedTime * 2.5);

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);
  };

  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animation);
  renderer.setClearColor('#262837');
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  moonLight.castShadow = true;
  doorLight.castShadow = true;
  doorLight.shadow.mapSize.width = 256;
  doorLight.shadow.mapSize.height = 256;
  doorLight.shadow.camera.far = 7;

  ghost1.castShadow = true;
  ghost1.shadow.mapSize.width = 256;
  ghost1.shadow.mapSize.height = 256;
  ghost1.shadow.camera.far = 7;

  ghost2.castShadow = true;
  ghost2.shadow.mapSize.width = 256;
  ghost2.shadow.mapSize.height = 256;
  ghost2.shadow.camera.far = 7;

  ghost3.castShadow = true;
  ghost3.shadow.mapSize.width = 256;
  ghost3.shadow.mapSize.height = 256;
  ghost3.shadow.camera.far = 7;

  bush1.castShadow = true;
  bush2.castShadow = true;
  bush3.castShadow = true;
  bush4.castShadow = true;

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
