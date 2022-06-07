import { useEffect, useRef } from 'react';
import {
  BufferAttribute,
  Color,
  AdditiveBlending,
  Clock,
  TextureLoader,
  BufferGeometry,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  PointsMaterial,
  Points,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const renderer = (targetDom) => {
  // Debug
  // const gui = new lil.GUI();

  // Scene
  const scene = new Scene();

  /**
   * Texture
   */
  const textureLoader = new TextureLoader();
  const particleTexture = textureLoader.load('/textures/particles/2.png');

  /**
   * Particles
   */
  const particlesGeometry = new BufferGeometry();

  const particlesMaterial = new PointsMaterial();
  particlesMaterial.size = 0.1;
  particlesMaterial.sizeAttenuation = true;
  // particlesMaterial.map = particleTexture;
  particlesMaterial.color = new Color('#ff9988');
  particlesMaterial.transparent = true;
  particlesMaterial.alphaMap = particleTexture;
  // particlesMaterial.alphaTest = 0.001;
  // particlesMaterial.depthTest = false;
  particlesMaterial.depthWrite = false;
  particlesMaterial.blending = AdditiveBlending;
  particlesMaterial.vertexColors = true;

  const particles = new Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  const count = 20000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random();
  }

  particlesGeometry.setAttribute('position', new BufferAttribute(positions, 3));
  particlesGeometry.setAttribute('color', new BufferAttribute(colors, 3));

  // const cube = new Mesh(new BoxGeometry(), new MeshBasicMaterial());
  // scene.add(cube);

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

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = particlesGeometry.attributes.position.array[i3];
      particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(
        elapsedTime + x
      );
    }

    particlesGeometry.attributes.position.needsUpdate = true;

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
