// tft-loader.js: 로딩 화면 및 리소스 프리로드 (production-ready)

let loaderDiv = null;

export function showLoader(message = '로딩 중...') {
  if (!loaderDiv) {
    loaderDiv = document.createElement('div');
    loaderDiv.id = 'tft-loader';
    loaderDiv.style.position = 'fixed';
    loaderDiv.style.top = '0';
    loaderDiv.style.left = '0';
    loaderDiv.style.width = '100vw';
    loaderDiv.style.height = '100vh';
    loaderDiv.style.background = 'rgba(20,30,40,0.85)';
    loaderDiv.style.display = 'flex';
    loaderDiv.style.flexDirection = 'column';
    loaderDiv.style.alignItems = 'center';
    loaderDiv.style.justifyContent = 'center';
    loaderDiv.style.zIndex = '9999';
    loaderDiv.innerHTML = `
      <div class="tft-loader-spinner" style="width:60px;height:60px;border:8px solid #eee;border-top:8px solid #3498db;border-radius:50%;animation:spin 1s linear infinite;"></div>
      <div class="tft-loader-msg" style="color:#fff;font-size:1.3em;margin-top:24px;">${message}</div>
      <style>
        @keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }
      </style>
    `;
    document.body.appendChild(loaderDiv);
  } else {
    loaderDiv.querySelector('.tft-loader-msg').textContent = message;
    loaderDiv.style.display = 'flex';
  }
}

export function hideLoader() {
  if (loaderDiv) loaderDiv.style.display = 'none';
}

// 리소스 프리로드 예시 (이미지, 3D 모델 등)
export async function preloadResources(resourceList = []) {
  showLoader('리소스 불러오는 중...');
  const promises = resourceList.map(res => {
    if (res.type === 'image') {
      return new Promise(resolve => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve;
        img.src = res.url;
      });
    }
    // 3D 모델, 오디오 등 확장 가능
    return Promise.resolve();
  });
  await Promise.all(promises);
  hideLoader();
}
