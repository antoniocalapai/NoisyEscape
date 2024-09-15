let scene;
let camera;
let renderer;
let laneWidth;
let laneLength;
let laneColor;
let player;
let playerGeometry;
let playerMaterial;
let playerLane;
let laneIndicator;
let lanes = [];
let maxVisibleLanes = 50;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    laneWidth = 1;
    laneLength = 20;
    laneColor = 0x808080;

    createInitialLanes();

    playerGeometry = new THREE.ConeGeometry(0.5, 1, 3);
    playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    player = new THREE.Mesh(playerGeometry, playerMaterial);
    scene.add(player);

    camera.position.set(0, 5, 5);
    camera.lookAt(0, 0, 0);

    playerLane = 0;
    player.position.x = playerLane * laneWidth;
    player.position.y = 0.5;
    player.position.z = 0;

    createLaneIndicator();
    updateLaneIndicator();
}

function createLane(index) {
    let laneGeometry = new THREE.PlaneGeometry(laneWidth * 0.9, laneLength);
    let laneMaterial = new THREE.MeshBasicMaterial({ color: laneColor, side: THREE.DoubleSide });
    let lane = new THREE.Mesh(laneGeometry, laneMaterial);
    lane.rotation.x = -Math.PI / 2;
    lane.position.set(index * laneWidth, 0, -laneLength / 2);
    scene.add(lane);
    lanes.push(lane);
}

function createInitialLanes() {
    for (let i = -maxVisibleLanes; i <= maxVisibleLanes; i++) {
        createLane(i);
    }
}

function createLaneIndicator() {
    laneIndicator = document.createElement('div');
    laneIndicator.style.position = 'absolute';
    laneIndicator.style.bottom = '10px';
    laneIndicator.style.width = '100%';
    laneIndicator.style.textAlign = 'center';
    laneIndicator.style.color = 'white';
    laneIndicator.style.fontSize = '20px';
    document.body.appendChild(laneIndicator);
}

function updateLaneIndicator() {
    laneIndicator.innerHTML = `Current Lane: ${playerLane}`;
}

function handlePlayerMovement(event) {
    if (event.key === 'ArrowLeft') {
        playerLane--;
        if (playerLane < -5) {
            resetPlayer();
        } else {
            playerJumpToLane(playerLane);
        }
    } else if (event.key === 'ArrowRight') {
        playerLane++;
        if (playerLane > 5) {
            resetPlayer();
        } else {
            playerJumpToLane(playerLane);
        }
    }
}

function playerJumpToLane(lane) {
    player.position.x = lane * laneWidth;
    camera.position.x = player.position.x;
    camera.lookAt(player.position.x, 0, -10);
    updateLaneIndicator();
}

function resetPlayer() {
    playerLane = 0;
    player.position.x = 0;
    camera.position.x = 0;
    updateLaneIndicator();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

document.addEventListener('keydown', handlePlayerMovement);

init();
animate();