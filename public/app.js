/* 🌸 咲想（sakisou） - Main JavaScript */

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
  flowersGrid: document.getElementById('flowers-grid'),
  bouquetImage: document.getElementById('bouquet-image'),
  
  backBtn: document.getElementById('back-btn'),
  shareBtn: document.getElementById('share-btn'),
  regenerateBtn: document.getElementById('regenerate-btn'),
  saveBtn: document.getElementById('save-btn'),
  retryBtn: document.getElementById('retry-btn'),
  errorMessage: document.getElementById('error-message')
};

// ===== State Management =====
let currentState = {
  isLoading: false,
  lastAnalysis: null,
  lastBouquet: null,
  lastMessage: ''
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
      btnText.textContent = isLoading ? '変換中...' : '想いを花に変換';
    }
  }
  
  debugLog(`Loading state: ${isLoading}`);
}

function showNotification(message, type = 'info') {
  // 簡単な通知システム
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
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
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
  
  // 感情タグを表示
  if (elements.emotionsList && analysis.emotions) {
    elements.emotionsList.innerHTML = '';
    
    analysis.emotions.forEach(emotion => {
      const emotionTag = document.createElement('span');
      emotionTag.className = `emotion-tag ${emotion}`;
      emotionTag.textContent = getEmotionDisplayName(emotion);
      elements.emotionsList.appendChild(emotionTag);
    });
  }
  
  // 説明文を表示
  if (elements.emotionExplanation && analysis.explanation) {
    elements.emotionExplanation.textContent = analysis.explanation;
  }
}

function displayFlowers(flowers) {
  if (!elements.flowersGrid || !flowers) return;
  
  elements.flowersGrid.innerHTML = '';
  
  flowers.forEach((flower, index) => {
    const flowerCard = document.createElement('div');
    flowerCard.className = 'flower-card';
    flowerCard.style.animationDelay = `${index * 0.1}s`;
    
    flowerCard.innerHTML = `
      <div class="flower-name">${flower.name} (${flower.nameEn})</div>
      <div class="flower-meaning">💝 ${flower.meaning}</div>
      <div class="flower-reason">✨ ${flower.reason}</div>
    `;
    
    elements.flowersGrid.appendChild(flowerCard);
    
    // アニメーション追加
    setTimeout(() => {
      flowerCard.classList.add('bounce-in');
    }, index * 100);
  });
}

function displayBouquet(bouquet) {
  if (!elements.bouquetImage || !bouquet) return;
  
  elements.bouquetImage.src = bouquet.imageUrl;
  elements.bouquetImage.alt = '生成された花束';
  
  // 画像読み込み完了時のエフェクト
  elements.bouquetImage.onload = () => {
    elements.bouquetImage.classList.add('fade-in');
    showNotification('美しい花束が完成しました！', 'success');
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
    
    // Step 1: 感情分析
    debugLog('Starting emotion analysis...');
    const emotionAnalysis = await analyzeEmotion(message);
    currentState.lastAnalysis = emotionAnalysis;
    
    // ローディングアニメーションのために少し待つ
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Step 2: 花束生成
    debugLog('Starting bouquet generation...');
    const bouquet = await generateBouquet(emotionAnalysis.flowers);
    currentState.lastBouquet = bouquet;
    
    // 結果表示
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
  // Message input events
  if (elements.messageInput) {
    elements.messageInput.addEventListener('input', updateCharCount);
    elements.messageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        processMessage();
      }
    });
  }
  
  // Generate button
  if (elements.generateBtn) {
    elements.generateBtn.addEventListener('click', processMessage);
  }
  
  // Example tags
  document.querySelectorAll('.example-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const exampleText = tag.getAttribute('data-text');
      if (exampleText && elements.messageInput) {
        elements.messageInput.value = exampleText;
        updateCharCount();
        
        // アニメーション効果
        elements.messageInput.style.background = 'var(--sakura-light)';
        setTimeout(() => {
          elements.messageInput.style.background = '';
        }, 500);
        
        showNotification('例文を入力しました', 'info');
      }
    });
  });
  
  // Navigation buttons
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
  
  // Action buttons
  if (elements.shareBtn) {
    elements.shareBtn.addEventListener('click', async () => {
      try {
        if (navigator.share && currentState.lastBouquet) {
          await navigator.share({
            title: '🌸 咲想 - 想いを花に',
            text: '私の想いが美しい花束になりました！',
            url: window.location.href
          });
        } else {
          // フォールバック: URLをコピー
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

想いを咲かせる、花と共に。

このアプリは、あなたの気持ちをAIが読み取り、
それにふさわしい花言葉を持つ花を提案し、
美しい花束の画像を生成します。

技術スタック:
• Gemini API（感情分析）
• Vertex AI（画像生成）
• Firebase Functions（バックエンド）
• Firebase Hosting（ホスティング）

AI Agent Hackathon with Google Cloud にて開発
  `.trim();
  
  alert(aboutText);
}

// ===== Initialization =====
async function initialize() {
  debugLog('🌸 咲想（sakisou） - Initializing...');
  debugLog('Environment:', CONFIG.DEBUG ? 'Development' : 'Production');
  debugLog('API Base URL:', CONFIG.API_BASE_URL);
  
  // Initialize event listeners
  initializeEventListeners();
  
  // Initialize character count
  updateCharCount();
  
  // Show initial section
  showSection('input');
  
  // Focus on input
  elements.messageInput?.focus();
  
  // Health check
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
    showNotification('咲想へようこそ！想いを花に変換しましょう🌸', 'success');
  }
  
  debugLog('🌸 咲想（sakisou） - Ready!');
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

// ===== Add CSS for notifications =====
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
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
`;
document.head.appendChild(notificationStyles);

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
