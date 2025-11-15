// tft-main.js: 3D 전투 필드 초기화 (Three.js, ES 모듈)
export function init3D() {
  const THREE = window.THREE;
  const TWEEN = window.TWEEN;
  let scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222222);

  let camera = new THREE.PerspectiveCamera(
    60, window.innerWidth / window.innerHeight, 0.1, 1000
  );
  camera.position.set(0, 20, 32);
  camera.lookAt(0, 0, 0);

  let renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('tft-3d-canvas'), antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 바닥(보드)
  const boardGeo = new THREE.PlaneGeometry(24, 16);
  const boardMat = new THREE.MeshStandardMaterial({ color: 0x444455 });
  const board = new THREE.Mesh(boardGeo, boardMat);
  board.rotation.x = -Math.PI / 2;
  scene.add(board);

  // 조명
  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambient);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
  dirLight.position.set(10, 20, 10);
  scene.add(dirLight);

  // tft-battle.js에 scene 연결 및 테스트 유닛 소환
  import('./tft-battle.js').then(mod => {
    mod.setBattleScene(scene);
    setTimeout(() => {
      mod.startBattle([
        { id: 'test1', x: -3, y: 2, isEnemy: false },
        { id: 'test2', x: 3, y: -2, isEnemy: true }
      ]);
    }, 800);
  });

  function animate() {
    requestAnimationFrame(animate);
    if (TWEEN) TWEEN.update();
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
