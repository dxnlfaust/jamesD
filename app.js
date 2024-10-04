let camera, scene, renderer;
let car, environment;
let keys = { left: false, right: false, forward: false, backward: false };
let velocity = 0;
const acceleration = 0.008;
const friction = 0.99;

const init = () => {
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);
    renderer.shadowMap.enabled = true; // Enable shadow maps

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 4, -5);
    camera.lookAt(0, 0, 0);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xF3FFFF, 1);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xF3FFFF, 0.4);
    sunLight.position.set(-10, 10, -10);
    scene.add(sunLight);
    
    const skyloader = new THREE.TextureLoader();
    skyloader.load('TrumanShowSkybox+Dusk.jpg', function(texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping; // Or ReflectionMapping if needed
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.BackSide, // The texture should be applied on the inside of the skybox
            transparent: true,    // Enable transparency
            opacity: 0.1          // Set the opacity to make it slightly transparent
    });
    
    const skyboxGeometry = new THREE.SphereGeometry(5000, 32, 32); // Create a large sphere for skybox
    const skybox = new THREE.Mesh(skyboxGeometry, material);
    
    // Scale vertically to lower the horizon
    skybox.rotation.y = Math.PI / 20; // Rotate 45 degrees on the Y axis
        
    scene.add(skybox);
    scene.background = texture;
    });

    // Load environment and car
    const loader = new THREE.GLTFLoader();
    loader.load('environment.glb', (gltf) => {
        environment = gltf.scene;
        environment.scale.set(1.2, 1.2, 1.2, 1.2);
        scene.add(environment);
    });
    loader.load('car.glb', (gltf) => {
        car = gltf.scene;
        car.position.set(0, 3.5, 0);
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

        if (keys.left) car.rotation.y += 0.05;
        if (keys.right) car.rotation.y -= 0.05;

        const relativeCameraOffset = new THREE.Vector3(0, -0.5, -6.5);
        const cameraOffset = relativeCameraOffset.applyMatrix4(car.matrixWorld);

        camera.position.lerp(cameraOffset, 0.3);
        camera.lookAt(car.position);
    }

    renderer.render(scene, camera);
};

init();

document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById('menu-button');
    const menuIcons = document.getElementById('menu-icons');

    menuButton.addEventListener('click', () => {
        if (menuIcons.style.display === 'none' || menuIcons.style.display === '') {
            menuIcons.style.display = 'block';
            menuButton.classList.add('active');
            menuButton.textContent = 'x';
        } else {
            menuIcons.style.display = 'none';
            menuButton.textContent = 'menu';
            menuButton.classList.remove('active');
        }
    });
});
