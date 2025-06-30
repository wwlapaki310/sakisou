/* 🌸 咲想（sakisou） - Enhanced Main JavaScript for Demo Video */

// ===== Configuration =====
const CONFIG = {
  // API Base URL - 自動的に環境を検出
  get API_BASE_URL() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      // 開発環境
      return 'http://localhost:5001/sakisou-dev/us-central1/api';
    } else {
      // 本番環境
      return 'https://us-central1-sakisou-dev.cloudfunctions.net/api';
    }
  },
  
  // UI設定
  MAX_CHARS: 500,
  TYPING_SPEED: 50,
  ANIMATION_DELAY: 300,
  LOADING_STEP_DELAY: 1000, // ローディングステップ間の遅延
  
  // デバッグモード
  DEBUG: window.location.hostname === 'localhost'
};

// デバッグログ関数
function debugLog(...args) {
  if (CONFIG.DEBUG) {
    console.log('🌸 Sakisou Debug:', ...args);
  }
}

// ===== DOM Elements =====
const elements = {
  messageInput: document.getElementById('message-input'),
  generateBtn: document.getElementById('generate-btn'),
  charCount: document.getElementById('char-count'),
  
  inputSection: document.getElementById('input-section'),
  loadingSection: document.getElementById('loading-section'),
  resultSection: document.getElementById('result-section'),
  errorSection: document.getElementById('error-section'),
  
  emotionsList: document.getElementById('emotions-list'),
  emotionExplanation: document.getElementById('emotion-explanation'),
  confidenceFill: document.getElementById('confidence-fill'),
  confidenceScore: document.getElementById('confidence-score'),
  flowersGrid: document.getElementById('flowers-grid'),
  bouquetImage: document.getElementById('bouquet-image'),
  bouquetTitle: document.getElementById('bouquet-title'),
  bouquetDescription: document.getElementById('bouquet-description'),
  
  backBtn: document.getElementById('back-btn'),
  shareBtn: document.getElementById('share-btn'),
  regenerateBtn: document.getElementById('regenerate-btn'),
  saveBtn: document.getElementById('save-btn'),
  retryBtn: document.getElementById('retry-btn'),
  errorMessage: document.getElementById('error-message'),
  
  // Loading steps
  step1: document.getElementById('step-1'),
  step2: document.getElementById('step-2'),
  step3: document.getElementById('step-3'),
  step4: document.getElementById('step-4')
};

// ===== State Management =====
let currentState = {
  isLoading: false,
  lastAnalysis: null,
  lastBouquet: null,
  lastMessage: '',
  currentLoadingStep: 0
};

// ===== Utility Functions =====
function showSection(sectionName) {
  // すべてのセクションを非表示
  Object.keys(elements).forEach(key => {
    if (key.includes('Section')) {
      const element = elements[key];
      if (element) {
        element.style.display = 'none';
        element.classList.remove('fade-in');
      }
    }
  });
  
  // 指定されたセクションを表示
  const targetSection = elements[sectionName + 'Section'];
  if (targetSection) {
    targetSection.style.display = 'block';
    setTimeout(() => {
      targetSection.classList.add('fade-in');
    }, 10);
  }
  
  debugLog(`Section changed to: ${sectionName}`);
}

function updateCharCount() {
  if (!elements.messageInput || !elements.charCount) return;
  
  const count = elements.messageInput.value.length;
  elements.charCount.textContent = count;
  
  if (count > CONFIG.MAX_CHARS) {
    elements.charCount.style.color = 'var(--love-red)';
    elements.messageInput.value = elements.messageInput.value.substring(0, CONFIG.MAX_CHARS);
  } else if (count > CONFIG.MAX_CHARS * 0.8) {
    elements.charCount.style.color = 'var(--hope-orange)';
  } else {
    elements.charCount.style.color = 'var(--text-light)';
  }
}

function setLoading(isLoading) {
  currentState.isLoading = isLoading;
  
  if (elements.generateBtn) {
    elements.generateBtn.disabled = isLoading;
    const btnText = elements.generateBtn.querySelector('.btn-text');
    if (btnText) {
      btnText.textContent = isLoading ? 'AI分析中...' : 'AIで想いを花束に変換';
    }
  }
  
  if (!isLoading) {
    currentState.currentLoadingStep = 0;
    resetLoadingSteps();
  }
  
  debugLog(`Loading state: ${isLoading}`);
}

function showNotification(message, type = 'info') {
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(n => n.remove());
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--sakura-pink);
    color: var(--white);
    padding: 12px 24px;
    border-radius: var(--radius-md);
    box-shadow: 0 4px 16px var(--shadow);
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
    font-weight: 500;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 4000);
}

// ===== Loading Animation Functions =====
function resetLoadingSteps() {
  [elements.step1, elements.step2, elements.step3, elements.step4].forEach(step => {
    if (step) {
      step.classList.remove('active', 'completed');
      const progress = step.querySelector('.step-progress');
      if (progress) {
        progress.style.width = '0%';
      }
    }
  });
}

function activateLoadingStep(stepNumber) {
  const stepElement = elements[`step${stepNumber}`];
  if (!stepElement) return;
  
  if (stepNumber > 1) {
    const prevStep = elements[`step${stepNumber - 1}`];
    if (prevStep) {
      prevStep.classList.remove('active');
      prevStep.classList.add('completed');
      const prevProgress = prevStep.querySelector('.step-progress');
      if (prevProgress) {
        prevProgress.style.width = '100%';
      }
    }
  }
  
  stepElement.classList.add('active');
  const progress = stepElement.querySelector('.step-progress');
  if (progress) {
    progress.style.width = '0%';
    setTimeout(() => {
      progress.style.width = '100%';
    }, 100);
  }
  
  debugLog(`Loading step ${stepNumber} activated`);
}

async function runLoadingAnimation() {
  resetLoadingSteps();
  
  activateLoadingStep(1);
  await new Promise(resolve => setTimeout(resolve, CONFIG.LOADING_STEP_DELAY));
  
  activateLoadingStep(2);
  await new Promise(resolve => setTimeout(resolve, CONFIG.LOADING_STEP_DELAY));
  
  activateLoadingStep(3);
  await new Promise(resolve => setTimeout(resolve, CONFIG.LOADING_STEP_DELAY));
  
  activateLoadingStep(4);
  await new Promise(resolve => setTimeout(resolve, CONFIG.LOADING_STEP_DELAY));
  
  const lastStep = elements.step4;
  if (lastStep) {
    lastStep.classList.remove('active');
    lastStep.classList.add('completed');
    const lastProgress = lastStep.querySelector('.step-progress');
    if (lastProgress) {
      lastProgress.style.width = '100%';
    }
  }
}

// ===== API Functions =====
async function apiRequest(endpoint, data = null, options = {}) {
  const url = CONFIG.API_BASE_URL + endpoint;
  
  const defaultOptions = {
    method: data ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options
  };
  
  if (data) {
    defaultOptions.body = JSON.stringify(data);
  }
  
  debugLog(`API Request: ${defaultOptions.method} ${url}`, data);
  
  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    const responseData = await response.json();
    debugLog(`API Response:`, responseData);
    return responseData;
    
  } catch (error) {
    debugLog(`API Error:`, error);
    throw error;
  }
}

async function analyzeEmotion(message) {
  return await apiRequest('/api/analyze-emotion', { message });
}

async function generateBouquet(flowers, style = 'realistic') {
  return await apiRequest('/api/generate-bouquet', { flowers, style });
}

async function checkAPIHealth() {
  try {
    const health = await apiRequest('/health');
    debugLog('API Health:', health);
    return health.status === 'healthy';
  } catch (error) {
    debugLog('API Health Check Failed:', error);
    return false;
  }
}

// ===== UI Update Functions =====
function displayEmotionAnalysis(analysis) {
  if (!analysis) return;
  
  if (elements.emotionsList && analysis.emotions) {
    elements.emotionsList.innerHTML = '';
    
    analysis.emotions.forEach(emotion => {
      const emotionTag = document.createElement('span');
      emotionTag.className = `emotion-tag ${emotion}`;
      emotionTag.textContent = getEmotionDisplayName(emotion);
      elements.emotionsList.appendChild(emotionTag);
    });
  }
  
  if (elements.emotionExplanation && analysis.explanation) {
    elements.emotionExplanation.textContent = analysis.explanation;
  }
  
  if (elements.confidenceFill && elements.confidenceScore && analysis.confidence) {
    const confidence = Math.round(analysis.confidence * 100);
    elements.confidenceScore.textContent = `${confidence}%`;
    elements.confidenceFill.style.width = `${confidence}%`;
    
    if (confidence >= 80) {
      elements.confidenceFill.style.background = 'var(--sage-green)';
    } else if (confidence >= 60) {
      elements.confidenceFill.style.background = 'var(--hope-orange)';
    } else {
      elements.confidenceFill.style.background = 'var(--love-red)';
    }
  }
}

function displayFlowers(flowers) {
  if (!elements.flowersGrid || !flowers) return;
  
  elements.flowersGrid.innerHTML = '';
  
  flowers.forEach((flower, index) => {
    const flowerCard = document.createElement('div');
    flowerCard.className = 'flower-card';
    flowerCard.style.animationDelay = `${index * 0.1}s`;
    
    const colorsText = flower.colors ? flower.colors.join('・') : '白';
    
    flowerCard.innerHTML = `
      <div class="flower-header">
        <div class="flower-name">${flower.name}</div>
        <div class="flower-name-en">${flower.nameEn}</div>
      </div>
      <div class="flower-meaning">💝 ${flower.meaning}</div>
      <div class="flower-colors">🎨 ${colorsText}</div>
      <div class="flower-reason">✨ ${flower.reason}</div>
    `;
    
    elements.flowersGrid.appendChild(flowerCard);
    
    setTimeout(() => {
      flowerCard.classList.add('bounce-in');
    }, index * 100);
  });
}

function displayBouquet(bouquet) {
  if (!elements.bouquetImage || !bouquet) return;
  
  elements.bouquetImage.src = bouquet.imageUrl;
  elements.bouquetImage.alt = '生成された花束';
  
  if (elements.bouquetTitle && currentState.lastAnalysis) {
    const emotions = currentState.lastAnalysis.emotions || [];
    const primaryEmotion = emotions[0] || 'unknown';
    const emotionName = getEmotionDisplayName(primaryEmotion);
    elements.bouquetTitle.textContent = `${emotionName}の花束`;
  }
  
  if (elements.bouquetDescription) {
    elements.bouquetDescription.textContent = 'あなたの想いを込めた特別な花束が完成しました';
  }
  
  elements.bouquetImage.onload = () => {
    elements.bouquetImage.classList.add('fade-in');
    showNotification('美しい花束が完成しました！🌸', 'success');
  };
  
  elements.bouquetImage.onerror = () => {
    elements.bouquetImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjVEN0UzIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjRDQ5OUI5IiBmb250LXNpemU9IjE4Ij7lm7Tlg4/jgYzlh7rjgaPjgb7jgZvjgpPjgafjgZfjgZ88L3RleHQ+Cjx0ZXh0IHg9IjIwMCIgeT0iMTgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjRDQ5OUI5IiBmb250LXNpemU9IjI0Ij7wn4yYPC90ZXh0Pgo8L3N2Zz4K';
    showNotification('画像の読み込みに失敗しました', 'error');
  };
}

function getEmotionDisplayName(emotion) {
  const emotionMap = {
    'gratitude': '感謝',
    'appreciation': '感謝', 
    'warmth': '温かさ',
    'love': '愛情',
    'apology': '謝罪',
    'regret': '後悔',
    'sincerity': '真摯',
    'hope': '希望',
    'sadness': '悲しみ',
    'joy': '喜び',
    'excitement': '興奮',
    'nostalgia': '懐かしさ',
    'encouragement': '応援',
    'support': '支援'
  };
  return emotionMap[emotion] || emotion;
}

// ===== Main Process Function =====
async function processMessage() {
  const message = elements.messageInput?.value?.trim();
  
  if (!message) {
    showNotification('メッセージを入力してください', 'warning');
    elements.messageInput?.focus();
    return;
  }
  
  if (message.length > CONFIG.MAX_CHARS) {
    showNotification(`メッセージは${CONFIG.MAX_CHARS}文字以下で入力してください`, 'warning');
    return;
  }
  
  try {
    setLoading(true);
    showSection('loading');
    currentState.lastMessage = message;
    
    const loadingAnimationPromise = runLoadingAnimation();
    
    debugLog('Starting emotion analysis...');
    const emotionAnalysis = await analyzeEmotion(message);
    currentState.lastAnalysis = emotionAnalysis;
    
    debugLog('Starting bouquet generation...');
    const bouquet = await generateBouquet(emotionAnalysis.flowers);
    currentState.lastBouquet = bouquet;
    
    await loadingAnimationPromise;
    await new Promise(resolve => setTimeout(resolve, 500));
    
    displayEmotionAnalysis(emotionAnalysis);
    displayFlowers(emotionAnalysis.flowers);
    displayBouquet(bouquet);
    
    showSection('result');
    
  } catch (error) {
    console.error('Error processing message:', error);
    
    let errorText = '申し訳ございません。想いを花に変換できませんでした。';
    
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      if (CONFIG.DEBUG) {
        errorText = `
          Firebase Emulatorに接続できませんでした。<br><br>
          <strong>解決方法:</strong><br>
          1. ターミナルで <code>firebase emulators:start</code> を実行<br>
          2. <a href="http://localhost:5001" target="_blank">http://localhost:5001</a> でFunctions確認<br>
          3. ページをリロード
        `;
      } else {
        errorText = 'サーバーに接続できませんでした。<br>しばらく時間をおいて再度お試しください。';
      }
    } else if (error.message.includes('500')) {
      errorText = 'サーバーでエラーが発生しました。<br>しばらく時間をおいて再度お試しください。';
    } else if (error.message.includes('400')) {
      errorText = '入力内容に問題があります。<br>メッセージを確認して再度お試しください。';
    }
    
    if (elements.errorMessage) {
      elements.errorMessage.innerHTML = errorText;
    }
    showSection('error');
    
  } finally {
    setLoading(false);
  }
}

// ===== Event Listeners =====
function initializeEventListeners() {
  if (elements.messageInput) {
    elements.messageInput.addEventListener('input', updateCharCount);
    elements.messageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        processMessage();
      }
    });
  }
  
  if (elements.generateBtn) {
    elements.generateBtn.addEventListener('click', processMessage);
  }
  
  document.querySelectorAll('.example-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const exampleText = tag.getAttribute('data-text');
      if (exampleText && elements.messageInput) {
        elements.messageInput.value = exampleText;
        updateCharCount();
        
        elements.messageInput.style.background = 'var(--sakura-light)';
        setTimeout(() => {
          elements.messageInput.style.background = '';
        }, 500);
        
        showNotification('例文を入力しました', 'info');
      }
    });
  });
  
  if (elements.backBtn) {
    elements.backBtn.addEventListener('click', () => {
      showSection('input');
      elements.messageInput?.focus();
    });
  }
  
  if (elements.retryBtn) {
    elements.retryBtn.addEventListener('click', () => {
      showSection('input');
      elements.messageInput?.focus();
    });
  }
  
  if (elements.shareBtn) {
    elements.shareBtn.addEventListener('click', async () => {
      try {
        if (navigator.share && currentState.lastBouquet) {
          await navigator.share({
            title: '🌸 咲想 - AIが花言葉で紡ぐ想い',
            text: '私の想いが美しい花束になりました！',
            url: window.location.href
          });
        } else {
          await navigator.clipboard.writeText(window.location.href);
          showNotification('リンクをコピーしました！', 'success');
        }
      } catch (error) {
        debugLog('Share error:', error);
        showNotification('シェアできませんでした', 'error');
      }
    });
  }
  
  if (elements.regenerateBtn) {
    elements.regenerateBtn.addEventListener('click', () => {
      if (currentState.lastMessage) {
        processMessage();
      } else {
        showSection('input');
        elements.messageInput?.focus();
      }
    });
  }
  
  if (elements.saveBtn) {
    elements.saveBtn.addEventListener('click', () => {
      if (currentState.lastBouquet) {
        const link = document.createElement('a');
        link.href = currentState.lastBouquet.imageUrl;
        link.download = `sakisou-bouquet-${Date.now()}.jpg`;
        link.target = '_blank';
        link.click();
        showNotification('画像を保存しました', 'success');
      }
    });
  }
}

// ===== Utility Functions for UI =====
function showAbout() {
  const aboutText = `
🌸 咲想（sakisou）について

AIが花言葉で紡ぐ、想いを花束で届けるWebアプリケーション

このアプリは、あなたの気持ちをGoogle Cloud AIが読み取り、
それにふさわしい花言葉を持つ花を提案し、
美しい花束の画像を生成して、実際に購入までできます。

技術スタック:
• Vertex AI Gemini API（感情分析）
• Cloud Run functions（バックエンド）
• Firebase Hosting（ホスティング）
• Firestore（データベース）

AI Agent Hackathon with Google Cloud にて開発
  `.trim();
  
  alert(aboutText);
}

// ===== Initialization =====
async function initialize() {
  debugLog('🌸 咲想（sakisou） - Initializing...');
  debugLog('Environment:', CONFIG.DEBUG ? 'Development' : 'Production');
  debugLog('API Base URL:', CONFIG.API_BASE_URL);
  
  initializeEventListeners();
  updateCharCount();
  showSection('input');
  elements.messageInput?.focus();
  
  debugLog('Performing health check...');
  const isHealthy = await checkAPIHealth();
  
  if (!isHealthy) {
    console.warn('⚠️ API health check failed');
    
    if (CONFIG.DEBUG) {
      elements.errorMessage.innerHTML = `
        <strong>開発環境でのエラー</strong><br><br>
        Firebase Emulatorが起動していないようです。<br><br>
        <strong>解決手順:</strong><br>
        1. ターミナルで <code>firebase emulators:start</code> を実行<br>
        2. <a href="http://localhost:4000" target="_blank">Emulator UI</a> で確認<br>
        3. このページをリロード
      `;
      showSection('error');
    } else {
      showNotification('サーバーに接続できません。後ほど再度お試しください。', 'warning');
    }
  } else {
    debugLog('✅ API is healthy');
    showNotification('🌸 咲想へようこそ！Google Cloud AIで想いを花束に変換しましょう', 'success');
  }
  
  debugLog('🌸 咲想（sakisou） - Ready for demo!');
}

// ===== Global Error Handlers =====
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
  if (CONFIG.DEBUG) {
    showNotification(`エラー: ${e.error?.message || 'Unknown error'}`, 'error');
  }
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
  if (CONFIG.DEBUG) {
    showNotification(`Promise rejection: ${e.reason?.message || 'Unknown error'}`, 'error');
  }
});

// ===== Start the application =====
document.addEventListener('DOMContentLoaded', initialize);

// ===== Add CSS for enhanced UI =====
const enhancedStyles = document.createElement('style');
enhancedStyles.textContent = `
@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes bounce-in {
  0% { transform: scale(0.3) rotate(-10deg); opacity: 0; }
  50% { transform: scale(1.05) rotate(2deg); }
  70% { transform: scale(0.9) rotate(-1deg); }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

.notification {
  font-family: var(--font-family);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.notification-success { background: var(--sage-green) !important; }
.notification-warning { background: var(--hope-orange) !important; }
.notification-error { background: var(--love-red) !important; }
.notification-info { background: var(--sakura-pink) !important; }

.bounce-in {
  animation: bounce-in 0.6s ease-out;
}

.step-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: var(--sakura-pink);
  transition: width 0.8s ease-out;
  border-radius: 2px;
}

.step.active .step-progress {
  background: var(--hope-orange);
}

.step.completed .step-progress {
  background: var(--sage-green);
}
`;
document.head.appendChild(enhancedStyles);

// ===== Export for debugging =====
if (typeof window !== 'undefined') {
  window.sakisouDebug = {
    config: CONFIG,
    state: currentState,
    elements,
    functions: {
      processMessage,
      checkAPIHealth,
      showSection,
      showNotification
    }
  };
}