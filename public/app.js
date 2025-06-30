/* 🌸 咲想（sakisou） - Main JavaScript */

// ===== Configuration =====
const CONFIG = {
  // Firebase Functions エンドポイント（開発環境）
  API_BASE_URL: 'http://localhost:5001/sakisou-dev/us-central1/api',
  // 本番環境用（必要に応じて変更）
  // API_BASE_URL: 'https://us-central1-sakisou-dev.cloudfunctions.net/api',
  
  // UI設定
  MAX_CHARS: 500,
  TYPING_SPEED: 50,
  ANIMATION_DELAY: 300
};

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
  lastBouquet: null
};

// ===== Utility Functions =====
function showSection(sectionName) {
  Object.values(elements).forEach(el => {
    if (el && el.style) {
      if (el.id.includes('section')) {
        el.style.display = 'none';
      }
    }
  });
  
  const targetSection = elements[sectionName + 'Section'];
  if (targetSection) {
    targetSection.style.display = 'block';
    targetSection.classList.add('fade-in');
  }
}

function updateCharCount() {
  const count = elements.messageInput.value.length;
  elements.charCount.textContent = count;
  
  if (count > CONFIG.MAX_CHARS) {
    elements.charCount.style.color = 'var(--love-red)';
    elements.messageInput.value = elements.messageInput.value.substring(0, CONFIG.MAX_CHARS);
  } else {
    elements.charCount.style.color = 'var(--text-light)';
  }
}

function setLoading(isLoading) {
  currentState.isLoading = isLoading;
  elements.generateBtn.disabled = isLoading;
  
  if (isLoading) {
    elements.generateBtn.querySelector('.btn-text').textContent = '変換中...';
  } else {
    elements.generateBtn.querySelector('.btn-text').textContent = '想いを花に変換';
  }
}

// ===== API Functions =====
async function analyzeEmotion(message) {
  try {
    console.log('Sending emotion analysis request...');
    const response = await fetch(`${CONFIG.API_BASE_URL}/analyze-emotion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Emotion analysis response:', data);
    return data;
  } catch (error) {
    console.error('Error analyzing emotion:', error);
    throw error;
  }
}

async function generateBouquet(flowers, style = 'realistic') {
  try {
    console.log('Sending bouquet generation request...');
    const response = await fetch(`${CONFIG.API_BASE_URL}/generate-bouquet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ flowers, style })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Bouquet generation response:', data);
    return data;
  } catch (error) {
    console.error('Error generating bouquet:', error);
    throw error;
  }
}

// ===== UI Update Functions =====
function displayEmotionAnalysis(analysis) {
  // Clear previous content
  elements.emotionsList.innerHTML = '';
  
  // Display emotions
  if (analysis.emotions && analysis.emotions.length > 0) {
    analysis.emotions.forEach(emotion => {
      const emotionTag = document.createElement('span');
      emotionTag.className = `emotion-tag ${emotion}`;
      emotionTag.textContent = getEmotionDisplayName(emotion);
      elements.emotionsList.appendChild(emotionTag);
    });
  }
  
  // Display explanation
  if (analysis.explanation) {
    elements.emotionExplanation.textContent = analysis.explanation;
  }
}

function displayFlowers(flowers) {
  // Clear previous content
  elements.flowersGrid.innerHTML = '';
  
  if (flowers && flowers.length > 0) {
    flowers.forEach((flower, index) => {
      const flowerCard = document.createElement('div');
      flowerCard.className = 'flower-card';
      flowerCard.style.animationDelay = `${index * 0.1}s`;
      flowerCard.classList.add('bounce-in');
      
      flowerCard.innerHTML = `
        <div class="flower-name">${flower.name}</div>
        <div class="flower-meaning">${flower.meaning}</div>
        <div class="flower-reason">${flower.reason}</div>
      `;
      
      elements.flowersGrid.appendChild(flowerCard);
    });
  }
}

function displayBouquet(bouquet) {
  if (bouquet && bouquet.imageUrl) {
    elements.bouquetImage.src = bouquet.imageUrl;
    elements.bouquetImage.alt = '生成された花束';
  }
}

function getEmotionDisplayName(emotion) {
  const emotionMap = {
    'gratitude': '感謝',
    'appreciation': '感謝',
    'warmth': '温かさ',
    'love': '愛情',
    'apology': '謝罪',
    'hope': '希望',
    'sadness': '悲しみ',
    'joy': '喜び',
    'excitement': '興奮',
    'nostalgia': '懐かしさ'
  };
  return emotionMap[emotion] || emotion;
}

// ===== Main Process Function =====
async function processMessage() {
  const message = elements.messageInput.value.trim();
  
  if (!message) {
    alert('メッセージを入力してください');
    return;
  }
  
  if (message.length > CONFIG.MAX_CHARS) {
    alert(`メッセージは${CONFIG.MAX_CHARS}文字以下で入力してください`);
    return;
  }
  
  try {
    setLoading(true);
    showSection('loading');
    
    // Step 1: 感情分析
    console.log('Starting emotion analysis...');
    const emotionAnalysis = await analyzeEmotion(message);
    currentState.lastAnalysis = emotionAnalysis;
    
    // ローディングアニメーションのために少し待つ
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Step 2: 花束生成
    console.log('Starting bouquet generation...');
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
    
    // エラーの種類に応じてメッセージを変更
    if (error.message.includes('Failed to fetch')) {
      errorText = 'サーバーに接続できませんでした。<br>Firebase Emulatorが起動しているか確認してください。';
    } else if (error.message.includes('500')) {
      errorText = 'サーバーエラーが発生しました。<br>しばらく時間をおいて再度お試しください。';
    }
    
    elements.errorMessage.innerHTML = errorText;
    showSection('error');
  } finally {
    setLoading(false);
  }
}

// ===== Event Listeners =====
function initializeEventListeners() {
  // Message input events
  elements.messageInput.addEventListener('input', updateCharCount);
  elements.messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      processMessage();
    }
  });
  
  // Generate button
  elements.generateBtn.addEventListener('click', processMessage);
  
  // Example tags
  document.querySelectorAll('.example-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const exampleText = tag.getAttribute('data-text');
      if (exampleText) {
        elements.messageInput.value = exampleText;
        updateCharCount();
        
        // アニメーション効果
        elements.messageInput.style.background = 'var(--sakura-light)';
        setTimeout(() => {
          elements.messageInput.style.background = '';
        }, 500);
      }
    });
  });
  
  // Navigation buttons
  elements.backBtn.addEventListener('click', () => {
    showSection('input');
    elements.messageInput.focus();
  });
  
  elements.retryBtn.addEventListener('click', () => {
    showSection('input');
    elements.messageInput.focus();
  });
  
  // Action buttons
  elements.shareBtn.addEventListener('click', () => {
    if (navigator.share && currentState.lastBouquet) {
      navigator.share({
        title: '🌸 咲想 - 想いを花に',
        text: '私の想いが美しい花束になりました',
        url: window.location.href
      }).catch(console.error);
    } else {
      // フォールバック: URLをコピー
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('リンクをコピーしました！');
      }).catch(() => {
        alert('シェア機能はこのブラウザではサポートされていません');
      });
    }
  });
  
  elements.regenerateBtn.addEventListener('click', () => {
    if (currentState.lastAnalysis) {
      processMessage();
    }
  });
  
  elements.saveBtn.addEventListener('click', () => {
    if (currentState.lastBouquet) {
      // 画像をダウンロード
      const link = document.createElement('a');
      link.href = currentState.lastBouquet.imageUrl;
      link.download = 'sakisou-bouquet.jpg';
      link.click();
    }
  });
}

// ===== Utility Functions for UI =====
function showAbout() {
  alert(`🌸 咲想（sakisou）について

想いを咲かせる、花と共に。

このアプリは、あなたの気持ちをAIが読み取り、
それにふさわしい花言葉を持つ花を提案し、
美しい花束の画像を生成します。

技術スタック:
- Google Cloud Gemini API（感情分析）
- Vertex AI（画像生成）
- Firebase Functions（バックエンド）
- Firebase Hosting（ホスティング）

AI Agent Hackathon with Google Cloud にて開発`);
}

// ===== Health Check Function =====
async function checkAPIHealth() {
  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/health`);
    const data = await response.json();
    console.log('API Health Check:', data);
    return data.status === 'healthy';
  } catch (error) {
    console.error('API Health Check Failed:', error);
    return false;
  }
}

// ===== Initialization =====
async function initialize() {
  console.log('🌸 咲想（sakisou） - Initializing...');
  
  // Initialize event listeners
  initializeEventListeners();
  
  // Initialize character count
  updateCharCount();
  
  // Show initial section
  showSection('input');
  
  // Focus on input
  elements.messageInput.focus();
  
  // Health check
  const isHealthy = await checkAPIHealth();
  if (!isHealthy) {
    console.warn('⚠️ API health check failed. Firebase Emulator may not be running.');
    elements.errorMessage.innerHTML = `
      Firebase Emulatorが起動していないようです。<br>
      <code>firebase emulators:start</code> を実行してください。
    `;
    showSection('error');
  } else {
    console.log('✅ API is healthy');
  }
  
  console.log('🌸 咲想（sakisou） - Ready!');
}

// ===== Start the application =====
document.addEventListener('DOMContentLoaded', initialize);

// ===== Global error handler =====
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});

// ===== Export for debugging =====
if (typeof window !== 'undefined') {
  window.sakisouDebug = {
    config: CONFIG,
    state: currentState,
    elements,
    processMessage,
    checkAPIHealth
  };
}
