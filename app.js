let camera, scene, renderer;
let car, environment;
let keys = { left: false, right: false, forward: false, backward: false };
let velocity = 0;
const acceleration = 0.002;
const friction = 0.99;

const init = () => {
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 4, -5);
    camera.lookAt(0, 0, 0);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xF3FFFF, 1);
    sunLight.position.set(-10, 10, -10);
    scene.add(sunLight);

    // Load environment and car
    const loader = new THREE.GLTFLoader();
    loader.load('environment.glb', (gltf) => {
        environment = gltf.scene;
        scene.add(environment);
    });
    loader.load('car.glb', (gltf) => {
        car = gltf.scene;
        car.position.set(0, 2.5, 0);
        scene.add(car);
    });

    // Event listeners
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // Mobile controls
    document.getElementById('left').addEventListener('touchstart', () => keys.left = true);
    document.getElementById('left').addEventListener('touchend', () => keys.left = false);
    document.getElementById('right').addEventListener('touchstart', () => keys.right = true);
    document.getElementById('right').addEventListener('touchend', () => keys.right = false);
    document.getElementById('accelerate').addEventListener('touchstart', () => keys.forward = true);
    document.getElementById('accelerate').addEventListener('touchend', () => keys.forward = false);
    document.getElementById('brake').addEventListener('touchstart', () => keys.backward = true);
    document.getElementById('brake').addEventListener('touchend', () => keys.backward = false);

    animate();
};

const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
};

const onKeyDown = (event) => {
    switch (event.code) {
        case 'ArrowLeft':
        case 'KeyA':
            keys.left = true;
            break;
        case 'ArrowRight':
        case 'KeyD':
            keys.right = true;
            break;
        case 'ArrowUp':
        case 'KeyW':
            keys.forward = true;
            break;
        case 'ArrowDown':
        case 'KeyS':
            keys.backward = true;
            break;
    }
};

const onKeyUp = (event) => {
    switch (event.code) {
        case 'ArrowLeft':
        case 'KeyA':
            keys.left = false;
            break;
        case 'ArrowRight':
        case 'KeyD':
            keys.right = false;
            break;
        case 'ArrowUp':
        case 'KeyW':
            keys.forward = false;
            break;
        case 'ArrowDown':
        case 'KeyS':
            keys.backward = false;
            break;
    }
};

const animate = () => {
    requestAnimationFrame(animate);

    if (car) {
        if (keys.forward) velocity += acceleration;
        if (keys.backward) velocity -= acceleration;

        velocity *= friction;

        car.translateZ(velocity);

        if (keys.left) car.rotation.y += 0.03;
        if (keys.right) car.rotation.y -= 0.03;

        const relativeCameraOffset = new THREE.Vector3(0, -0.5, -5.5);
        const cameraOffset = relativeCameraOffset.applyMatrix4(car.matrixWorld);

        camera.position.lerp(cameraOffset, 0.3);
        camera.lookAt(car.position);
    }

    renderer.render(scene, camera);
};

init();
