// tft-3d-models.js: 3D 유닛/오브젝트 모델 관리 (추후 구현)
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// 챔피언 id별 glTF 모델 경로 매핑 (예시)
const CHAMPION_MODEL_MAP = {
  // 예: 'trainee_rifleman': '/models/trainee_rifleman.glb',
  // 실제 모델 파일이 있으면 경로 추가, 없으면 undefined
};

const gltfLoader = new GLTFLoader();

// 비동기 챔피언 3D 모델 생성 (glTF 우선, 없으면 큐브)
export async function createChampion3D(id, color = 0x3399ff) {
  const modelUrl = CHAMPION_MODEL_MAP[id];
  if (modelUrl) {
    try {
      const gltf = await gltfLoader.loadAsync(modelUrl);
      const model = gltf.scene;
      model.userData.type = 'champion';
      model.userData.championId = id;
      model.traverse(obj => { if (obj.isMesh) obj.castShadow = true; });
      return model;
    } catch (e) {
      // 로드 실패 시 프록시
      return createChampionMesh(id, color);
    }
  } else {
    return createChampionMesh(id, color);
  }
}

// 비동기 크리처 3D 모델 생성 (확장 가능)
export async function createCreep3D(id, color = 0x996633) {
  // 추후 id별 모델 매핑 가능
  return createCreepMesh(id, color);
}

// 기본 큐브/구 등 프록시 모델 생성 (동기)
export function createChampionMesh(id, color = 0x3399ff) {
  const geometry = new THREE.BoxGeometry(1, 1.2, 1);
  const material = new THREE.MeshStandardMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.userData.type = 'champion';
  mesh.userData.championId = id;
  return mesh;
}

export function createCreepMesh(id, color = 0x996633) {
  const geometry = new THREE.SphereGeometry(0.7, 24, 16);
  const material = new THREE.MeshStandardMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.userData.type = 'creep';
  mesh.userData.creepId = id;
  return mesh;
}



// 간단한 애니메이션 및 확장 구조
export function animateUnit(mesh, type = 'idle') {
  if (!mesh) return;
  if (type === 'jump') {
    // 위로 점프 후 내려오기
    const startY = mesh.position.y;
    let t = 0;
    function jumpAnim() {
      t += 0.08;
      mesh.position.y = startY + Math.sin(Math.PI * t) * 0.7;
      if (t < 1) {
        requestAnimationFrame(jumpAnim);
      } else {
        mesh.position.y = startY;
      }
    }
    jumpAnim();
  }
  // 추후: 'walk', 'attack', 'die' 등 애니메이션 타입별로 분기 확장 가능
}
