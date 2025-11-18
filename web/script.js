import { SCENARIO_INFO } from './scenarios.js';

// --- DOM ELEMENTLERİ ---
const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const micButton = document.getElementById('mic-button');

// Modal Elemanları
const resultModal = document.getElementById('result-modal');
const endMeetingBtn = document.getElementById('end-meeting-btn'); // Bitir butonu
const restartBtn = document.getElementById('restart-btn'); // Dashboard'a dön butonu

// Skor Alanları
const avgGrammarSpan = document.getElementById('avg-grammar');
const avgVocabSpan = document.getElementById('avg-vocab');
const allMistakesUl = document.getElementById('all-mistakes-list');

// Görev Kartı
const missionTitle = document.getElementById('mission-title');
const missionDesc = document.getElementById('mission-desc');
const detailedHintsUl = document.getElementById('detailed-hints');

// --- DURUM ---
let conversationHistory = [];
let currentScenario = "crisis";
let isRecording = false; 
let sessionScores = { grammar: [], vocab: [], mistakes: [] };

// --- BAŞLANGIÇ ---
window.onload = function() {
    
    // 1. URL'den Senaryoyu Al
    const urlParams = new URLSearchParams(window.location.search);
    const scenarioFromUrl = urlParams.get('scenario');

    if (scenarioFromUrl && SCENARIO_INFO[scenarioFromUrl]) {
        currentScenario = scenarioFromUrl;
    } else {
        // Eğer URL boşsa varsayılanı al (Test için)
        currentScenario = Object.keys(SCENARIO_INFO)[0];
    }

    // 2. BUTONLARI BAĞLA (EN ÖNEMLİ KISIM)
    // Toplantıyı Bitir Butonu
    if (endMeetingBtn) {
        endMeetingBtn.addEventListener('click', finishMeeting);
    }
    
    // Görev Listesine Dön Butonu
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            window.location.href = "index.html"; // Dashboard'a yönlendir
        });
    }

    // Başlat
    updateMissionCard();
    startScenarioConversation(); 
};

// --- TOPLANTIYI BİTİR ---
function finishMeeting() {
    console.log("Toplantı bitiriliyor...");

    // 1. Ortalamaları Hesapla
    const grammarAvg = calculateAverage(sessionScores.grammar);
    const vocabAvg = calculateAverage(sessionScores.vocab);

    // 2. Verileri Modala Yaz
    if(avgGrammarSpan) avgGrammarSpan.textContent = grammarAvg;
    if(avgVocabSpan) avgVocabSpan.textContent = vocabAvg;

    // 3. Hataları Listele
    if(allMistakesUl) {
        allMistakesUl.innerHTML = "";
        if (sessionScores.mistakes.length > 0) {
            const uniqueMistakes = [...new Set(sessionScores.mistakes)];
            uniqueMistakes.forEach(mistake => {
                const li = document.createElement('li');
                li.textContent = mistake;
                allMistakesUl.appendChild(li);
            });
        } else {
            allMistakesUl.innerHTML = "<li style='color:green'>Mükemmel! Hiç hata tespit edilmedi.</li>";
        }
    }

    // 4. Modalı Göster
    if(resultModal) resultModal.style.display = "flex";
}

function calculateAverage(arr) {
    if (!arr || arr.length === 0) return 0;
    const sum = arr.reduce((a, b) => a + b, 0);
    return Math.round(sum / arr.length);
}

// ... (Kodun geri kalanı, yani updateMissionCard, sendMessage, sesli giriş vb. AYNI KALSIN) ...
// KODUN GERİ KALANI İÇİN AŞAĞIDAKİ BLOKLARI KOPYALAYABİLİRSİN:

function updateMissionCard() {
    const info = SCENARIO_INFO[currentScenario];
    if (!info) return;

    document.getElementById("mission-title").textContent = info.title;
    document.getElementById("mission-desc").textContent = info.desc;
    
    detailedHintsUl.innerHTML = "";
    if (info.hints) {
        info.hints.forEach(hint => {
            const li = document.createElement("li");
            li.textContent = hint;
            li.style.marginBottom = "5px";
            detailedHintsUl.appendChild(li);
        });
    }
    if (info.keywords) {
        const kwLi = document.createElement("li");
        kwLi.innerHTML = `<strong>Kelimeler:</strong> <span style="color:#007bff">${info.keywords.join(", ")}</span>`;
        kwLi.style.marginTop = "10px";
        kwLi.style.listStyle = "none";
        detailedHintsUl.appendChild(kwLi);
    }
}

async function startScenarioConversation() {
    const loadingId = "loading-" + Date.now();
    const loadingDiv = document.createElement('div');
    loadingDiv.id = loadingId;
    loadingDiv.className = "message agent";
    loadingDiv.innerHTML = `<div class="message-content" style="font-style:italic; color:#666;">Toplantıya bağlanılıyor...</div>`;
    messagesDiv.appendChild(loadingDiv);

    try {
        const triggerMessage = "[SYSTEM: User joined. Start immediately as character. German.]";
        const response = await fetch('/simulate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_message: triggerMessage, history: [], scenario_id: currentScenario }),
        });

        if(document.getElementById(loadingId)) document.getElementById(loadingId).remove();
        
        if (!response.ok) throw new Error(`API Error`);
        const data = await response.json();
        processAIResponse(data);

    } catch (error) {
        if(document.getElementById(loadingId)) document.getElementById(loadingId).remove();
        console.error("Başlatma hatası:", error);
    }
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage(message, 'user');
    userInput.value = '';
    sendButton.disabled = true;
    
    conversationHistory.push({ role: 'user', parts: [{ text: message }] });

    try {
        const response = await fetch('/simulate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_message: message, history: conversationHistory, scenario_id: currentScenario }),
        });

        if (!response.ok) throw new Error(`API Error`);
        const data = await response.json();
        processAIResponse(data);

    } catch (error) {
        console.error("Hata:", error);
        appendMessage("Hata oluştu.", 'agent', 'System');
    } finally {
        sendButton.disabled = false;
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
}

function processAIResponse(data) {
    data.responses.forEach(r => conversationHistory.push({ role: 'model', parts: [{ text: r.text }] }));

    if (data.evaluation) {
        if (data.evaluation.grammar_score > 0) {
            sessionScores.grammar.push(data.evaluation.grammar_score);
            sessionScores.vocab.push(data.evaluation.vocabulary_score);
        }
        if (data.evaluation.mistakes && data.evaluation.mistakes.length > 0) {
            sessionScores.mistakes.push(...data.evaluation.mistakes);
        }
    }

    let audioQueue = [];
    for (const aiResponse of data.responses) {
        appendMessage(aiResponse.text, 'agent', aiResponse.speaker);
        audioQueue.push({ text: aiResponse.text, speaker: aiResponse.speaker });
    }
    playAudioQueue(audioQueue);
}

async function playAudioQueue(queue) {
    if (queue.length === 0) return;
    const item = queue.shift();
    
    try {
        const audioResponse = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: item.text, speaker: item.speaker })
        });

        if (audioResponse.ok) {
            const audioBlob = await audioResponse.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.onended = () => { playAudioQueue(queue); };
            audio.addEventListener('canplaythrough', () => {
                setTimeout(() => { audio.play().catch(e => console.error(e)); }, 50); 
            }, { once: true });
            audio.load();
        } else {
            playAudioQueue(queue);
        }
    } catch (e) {
        playAudioQueue(queue);
    }
}

function appendMessage(text, type, speaker = null) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', type);
    if (speaker) messageElement.classList.add(speaker.toLowerCase());

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    
    if (speaker) {
        const speakerName = document.createElement('div');
        speakerName.classList.add('speaker-label');
        speakerName.textContent = speaker;
        contentDiv.appendChild(speakerName);
    }
    
    contentDiv.innerHTML += text;
    messageElement.appendChild(contentDiv);
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// --- SESLİ GİRİŞ ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let textBeforeRecording = "";

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'de-DE'; 
    recognition.continuous = true; 
    recognition.interimResults = true; 

    micButton.addEventListener('click', async () => {
        if (isRecording) {
            recognition.stop();
        } else {
            // Mikrofon izni kontrolü
            try {
                await navigator.mediaDevices.getUserMedia({ audio: true });
            } catch (error) {
                alert('Mikrofon izni gerekli. Lütfen tarayıcı ayarlarından mikrofon iznini verin.');
                console.error('Mikrofon izni hatası:', error);
                return;
            }
            
            textBeforeRecording = userInput.value;
            if (textBeforeRecording.length > 0) textBeforeRecording += " "; 
            
            try {
                recognition.start();
            } catch (error) {
                console.error('Speech recognition başlatma hatası:', error);
                alert('Ses tanıma başlatılamadı. Lütfen tekrar deneyin.');
            }
        }
    });

    recognition.onstart = () => {
        isRecording = true;
        micButton.classList.add('recording');
        userInput.placeholder = "Dinleniyor...";
        console.log('Mikrofon aktif');
    };

    recognition.onend = () => {
        isRecording = false;
        micButton.classList.remove('recording');
        userInput.placeholder = "Mesajını buraya yaz (Almanca)...";
        console.log('Mikrofon durduruldu');
    };

    recognition.onresult = (event) => {
        let currentSessionTranscript = "";
        for (let i = 0; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                currentSessionTranscript += event.results[i][0].transcript;
            } else {
                // Geçici sonuçları da göster
                currentSessionTranscript += event.results[i][0].transcript;
            }
        }
        userInput.value = textBeforeRecording + currentSessionTranscript;
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition hatası:', event.error);
        isRecording = false;
        micButton.classList.remove('recording');
        userInput.placeholder = "Mesajını buraya yaz (Almanca)...";
        
        let errorMessage = '';
        switch(event.error) {
            case 'no-speech':
                errorMessage = 'Konuşma algılanamadı. Tekrar deneyin.';
                break;
            case 'audio-capture':
                errorMessage = 'Mikrofon bulunamadı veya erişilemiyor.';
                break;
            case 'not-allowed':
                errorMessage = 'Mikrofon izni reddedildi. Lütfen tarayıcı ayarlarından izin verin.';
                break;
            case 'network':
                errorMessage = 'Ağ hatası. İnternet bağlantınızı kontrol edin.';
                break;
            default:
                errorMessage = `Ses tanıma hatası: ${event.error}`;
        }
        
        if (event.error !== 'no-speech') {
            alert(errorMessage);
        }
    };
} else {
    console.warn('Web Speech API desteklenmiyor');
    if (micButton) {
        micButton.style.display = 'none';
        console.log('Mikrofon butonu gizlendi - API desteklenmiyor');
    }
}

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });