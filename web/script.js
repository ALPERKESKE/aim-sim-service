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
let currentUsername = "";
let selectedMembers = ["Thomas", "Sarah", "Mark", "Lukas"]; // Varsayılan olarak hepsi

// --- BAŞLANGIÇ ---
window.onload = function() {
    
    // 1. URL'den Senaryo ve Ekip Üyelerini Al
    const urlParams = new URLSearchParams(window.location.search);
    const scenarioFromUrl = urlParams.get('scenario');
    const membersFromUrl = urlParams.get('members');

    if (scenarioFromUrl && SCENARIO_INFO[scenarioFromUrl]) {
        currentScenario = scenarioFromUrl;
    } else {
        // Eğer URL boşsa varsayılanı al (Test için)
        currentScenario = Object.keys(SCENARIO_INFO)[0];
    }

    if (membersFromUrl) {
        selectedMembers = membersFromUrl.split(',');
        console.log('Seçilen ekip üyeleri:', selectedMembers);
    } else {
        console.log('URL\'de members parametresi yok, varsayılan kullanılıyor:', selectedMembers);
    }

    // 2. KULLANICI ADI GİRİŞİ (localStorage'dan veya URL'den)
    const usernameModal = document.getElementById('username-modal');
    const usernameInput = document.getElementById('username-input');
    const joinMeetingBtn = document.getElementById('join-meeting-btn');
    const mainWrapper = document.getElementById('main-wrapper');
    const currentUsernameSpan = document.getElementById('current-username');

    // Kullanıcı adını localStorage'dan al (dashboard'dan geliyorsa)
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
        currentUsername = savedUsername;
        currentUsernameSpan.textContent = `👤 ${currentUsername}`;
        usernameModal.style.display = 'none';
        mainWrapper.style.display = 'block';
        initializeMeeting();
    } else {
        // Eğer localStorage'da yoksa modal göster
        usernameModal.style.display = 'flex';
        usernameInput.focus();
    }

    joinMeetingBtn.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        if (username) {
            currentUsername = username;
            localStorage.setItem('username', username); // Kaydet
            currentUsernameSpan.textContent = `👤 ${username}`;
            usernameModal.style.display = 'none';
            mainWrapper.style.display = 'block';
            initializeMeeting();
        } else {
            alert('Lütfen adınızı girin!');
        }
    });

    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            joinMeetingBtn.click();
        }
    });

    // 3. BUTONLARI BAĞLA
    if (endMeetingBtn) {
        endMeetingBtn.addEventListener('click', finishMeeting);
    }
    
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            window.location.href = "index.html";
        });
    }
};

function initializeMeeting() {
    updateMissionCard();
    startScenarioConversation();
}

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
    
    // İpuçları
    if (info.hints && info.hints.length > 0) {
        const hintsTitle = document.createElement("li");
        hintsTitle.innerHTML = `<strong style="color:#495057;">💡 İpuçları:</strong>`;
        hintsTitle.style.listStyle = "none";
        hintsTitle.style.marginBottom = "8px";
        detailedHintsUl.appendChild(hintsTitle);
        
        info.hints.forEach(hint => {
            const li = document.createElement("li");
            li.textContent = hint;
            li.style.marginBottom = "5px";
            li.style.marginLeft = "20px";
            detailedHintsUl.appendChild(li);
        });
    }
    
    // Kelimeler
    if (info.keywords && info.keywords.length > 0) {
        const kwLi = document.createElement("li");
        kwLi.innerHTML = `<strong style="color:#495057;">📚 Önemli Kelimeler:</strong> <span style="color:#007bff">${info.keywords.join(", ")}</span>`;
        kwLi.style.marginTop = "15px";
        kwLi.style.listStyle = "none";
        detailedHintsUl.appendChild(kwLi);
    }
    
    // Örnek Cümleler (Gizli başlar, buton ile gösterilir)
    if (info.exampleSentences && info.exampleSentences.length > 0) {
        const examplesContainer = document.createElement("li");
        examplesContainer.style.listStyle = "none";
        examplesContainer.style.marginTop = "15px";
        
        const examplesTitle = document.createElement("div");
        examplesTitle.style.display = "flex";
        examplesTitle.style.alignItems = "center";
        examplesTitle.style.gap = "10px";
        examplesTitle.innerHTML = `<strong style="color:#495057;">💬 Örnek Cümleler:</strong>`;
        
        const toggleBtn = document.createElement("button");
        toggleBtn.textContent = "Göster";
        toggleBtn.id = "toggle-examples-btn";
        toggleBtn.style.cssText = "padding: 5px 12px; background: #28a745; color: white; border: none; border-radius: 5px; font-size: 0.85rem; cursor: pointer;";
        
        const examplesList = document.createElement("ul");
        examplesList.id = "examples-list";
        examplesList.style.display = "none";
        examplesList.style.marginTop = "8px";
        examplesList.style.paddingLeft = "20px";
        examplesList.style.listStyle = "none";
        
        info.exampleSentences.forEach(sentence => {
            const li = document.createElement("li");
            li.innerHTML = `<em style="color:#28a745;">"${sentence}"</em>`;
            li.style.marginBottom = "8px";
            li.style.fontSize = "0.85rem";
            examplesList.appendChild(li);
        });
        
        toggleBtn.addEventListener('click', () => {
            if (examplesList.style.display === 'none') {
                examplesList.style.display = 'block';
                toggleBtn.textContent = 'Gizle';
                toggleBtn.style.background = '#dc3545';
            } else {
                examplesList.style.display = 'none';
                toggleBtn.textContent = 'Göster';
                toggleBtn.style.background = '#28a745';
            }
        });
        
        examplesTitle.appendChild(toggleBtn);
        examplesContainer.appendChild(examplesTitle);
        examplesContainer.appendChild(examplesList);
        detailedHintsUl.appendChild(examplesContainer);
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
        // Başlangıç mesajını seçilen karakterlere göre özelleştir
        const membersList = selectedMembers.join(', ');
        const firstCharacter = selectedMembers[0];
        
        // Eğer birden fazla karakter varsa, önce kendi aralarında selamlaşsınlar
        let triggerMessage;
        if (selectedMembers.length > 1) {
            triggerMessage = `[SYSTEM: User joined the meeting. There are ${selectedMembers.length} characters present: ${membersList}. FIRST: Let the characters greet each other briefly (2-3 short messages between them). THEN: One of them should greet the user and explain the meeting topic. DO NOT use Thomas, Sarah, or any character NOT in this list: ${membersList}. German.]`;
        } else {
            triggerMessage = `[SYSTEM: User joined the meeting. Start with a friendly greeting (Begrüßung) as ${firstCharacter}. Introduce yourself briefly and mention the meeting topic. DO NOT use Thomas, Sarah, or any character NOT in this list: ${membersList}. German.]`;
        }
        
        const requestBody = { 
            user_message: triggerMessage, 
            history: [], 
            scenario_id: currentScenario,
            members: selectedMembers 
        };
        console.log('Backend\'e gönderilen request:', requestBody);
        console.log('Seçilen karakterler:', selectedMembers);
        
        const response = await fetch('/simulate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
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

async function sendMessage(optionalMessage = null) {
    const message = optionalMessage || userInput.value.trim();
    if (!message) return;

    // Eğer optionalMessage varsa, user input'tan değil parametreden al
    if (!optionalMessage) {
        appendMessage(message, 'user');
        userInput.value = '';
    } else {
        // Otomatik mesaj için görsel bir gösterge ekle (opsiyonel)
        console.log(`🤖 Otomatik follow-up mesajı: ${message}`);
    }
    
    sendButton.disabled = true;
    
    conversationHistory.push({ role: 'user', parts: [{ text: message }] });

    try {
        const response = await fetch('/simulate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                user_message: message, 
                history: conversationHistory, 
                scenario_id: currentScenario,
                members: selectedMembers 
            }),
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
    // Backend'den gelen response'u kontrol et
    console.log('AI Response alındı:', data);
    console.log('Response speaker\'ları:', data.responses?.map(r => r.speaker));
    console.log('Seçilen üyeler:', selectedMembers);
    
    // Sadece seçilen üyelerin response'larını işle
    const validResponses = data.responses.filter(r => {
        const speaker = r.speaker?.trim();
        const isValid = selectedMembers.some(m => m.toLowerCase() === speaker?.toLowerCase());
        if (!isValid) {
            console.warn(`⚠️ Geçersiz speaker filtrelendi: ${speaker}`);
        }
        return isValid;
    });
    
    // Eğer hiç geçerli response yoksa, ilk seçilen üyeyi kullan
    if (validResponses.length === 0 && selectedMembers.length > 0) {
        console.warn('⚠️ Hiç geçerli response yok, ilk seçilen üye kullanılıyor');
        validResponses.push({
            speaker: selectedMembers[0],
            text: "Entschuldigung, ich habe das nicht richtig verstanden. Können Sie das nochmal erklären?",
            mood: "neutral"
        });
    }
    
    // Geçerli response'ları conversation history'ye ekle
    validResponses.forEach(r => conversationHistory.push({ role: 'model', parts: [{ text: r.text }] }));

    if (data.evaluation) {
        if (data.evaluation.grammar_score > 0) {
            sessionScores.grammar.push(data.evaluation.grammar_score);
            sessionScores.vocab.push(data.evaluation.vocabulary_score);
        }
        if (data.evaluation.mistakes && data.evaluation.mistakes.length > 0) {
            sessionScores.mistakes.push(...data.evaluation.mistakes);
        }
    }

    // Mesajları sırayla göster ve ses çal
    displayMessagesSequentially(validResponses);
}

async function displayMessagesSequentially(responses) {
    const audioQueue = [];
    
    for (let i = 0; i < responses.length; i++) {
        const aiResponse = responses[i];
        
        // Speaker adını normalize et (ilk harf büyük, geri kalan küçük)
        let speakerName = aiResponse.speaker?.trim() || 'System';
        // İlk harfi büyük yap
        speakerName = speakerName.charAt(0).toUpperCase() + speakerName.slice(1).toLowerCase();
        
        // Seçilen üyelerle eşleştir (büyük/küçük harf duyarsız)
        const matchedMember = selectedMembers.find(m => m.toLowerCase() === speakerName.toLowerCase());
        if (matchedMember) {
            speakerName = matchedMember; // Orijinal formatta kullan (örn: "Lukas")
        }
        
        console.log(`📝 Mesaj gösteriliyor: ${speakerName} - "${aiResponse.text.substring(0, 50)}..."`);
        
        // Mesajı göster
        appendMessage(aiResponse.text, 'agent', speakerName);
        
        // Ses kuyruğuna ekle (normalize edilmiş speaker adı ile)
        audioQueue.push({ text: aiResponse.text, speaker: speakerName });
        
        // Son mesaj değilse, bir sonraki mesajdan önce kısa bir bekleme
        if (i < responses.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 800)); // 800ms bekleme
        }
    }
    
    // Tüm mesajlar gösterildikten sonra sesleri çal
    if (audioQueue.length > 0) {
        console.log(`🎵 Ses kuyruğu hazırlandı: ${audioQueue.map(q => q.speaker).join(', ')}`);
        playAudioQueue(audioQueue);
    }
    
    // Eğer son mesaj bir karaktere hitap ediyorsa, otomatik olarak o karakterin cevap vermesini sağla
    if (responses.length > 0) {
        const lastResponse = responses[responses.length - 1];
        const lastText = lastResponse.text;
        
        // Seçilen üyelerden birine hitap edilip edilmediğini kontrol et
        for (const member of selectedMembers) {
            // Karakter adı mesajda geçiyor mu? (virgülle, noktayla veya boşlukla)
            const patterns = [
                new RegExp(`\\b${member}\\s*,`, 'i'),  // "Mark,"
                new RegExp(`,\\s*${member}\\b`, 'i'),  // ", Mark"
                new RegExp(`\\b${member}\\s+`, 'i'),   // "Mark "
                new RegExp(`${member}\\?`, 'i')        // "Mark?"
            ];
            
            const isAddressed = patterns.some(pattern => pattern.test(lastText));
            
            if (isAddressed && lastResponse.speaker?.toLowerCase() !== member.toLowerCase()) {
                console.log(`💬 ${lastResponse.speaker} hat ${member} angesprochen. Automatische Antwort wird angefordert...`);
                
                // Kısa bir bekleme sonrası otomatik follow-up gönder
                setTimeout(async () => {
                    // User mesajı olmadan, sadece context ile follow-up gönder
                    await sendMessage(`[CONTEXT: ${lastResponse.speaker} hat ${member} angesprochen. ${member} sollte jetzt antworten.]`);
                }, 2000); // 2 saniye bekle (sesler çalınırken)
                
                break; // İlk eşleşmede dur
            }
        }
    }
}

// Şu anda çalan sesi takip et (paralel çalmayı önlemek için)
let isPlayingAudio = false;

async function playAudioQueue(queue) {
    // Eğer zaten bir ses çalıyorsa, bekle
    if (isPlayingAudio) {
        console.log('⏳ Başka bir ses çalıyor, bekleniyor...');
        // 100ms sonra tekrar dene
        setTimeout(() => playAudioQueue(queue), 100);
        return;
    }
    
    if (queue.length === 0) {
        console.log('✅ Tüm sesler çalındı');
        isPlayingAudio = false;
        return;
    }
    
    const item = queue.shift();
    
    // Speaker adını kesinlikle doğru formatta gönder (ilk harf büyük)
    const speakerName = item.speaker?.charAt(0).toUpperCase() + item.speaker?.slice(1).toLowerCase() || 'System';
    
    console.log(`🔊 Ses çalınıyor: ${speakerName} (orijinal: ${item.speaker}) - "${item.text.substring(0, 50)}..."`);
    console.log(`📤 TTS API'ye gönderilen speaker: "${speakerName}"`);
    
    isPlayingAudio = true;
    
    try {
        const audioResponse = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: item.text, speaker: speakerName })
        });

        if (audioResponse.ok) {
            const audioBlob = await audioResponse.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            
            // Ses çalma işlemini Promise ile yönet
            await new Promise((resolve, reject) => {
                // Ses bittiğinde resolve et
                audio.onended = () => {
                    console.log(`✅ ${speakerName} sesi bitti, sıradakine geçiliyor`);
                    URL.revokeObjectURL(audioUrl); // Memory temizliği
                    isPlayingAudio = false;
                    resolve();
                };
                
                // Hata durumunda da resolve et (devam et)
                audio.onerror = (e) => {
                    console.error(`❌ Ses çalma hatası (${speakerName}):`, e);
                    URL.revokeObjectURL(audioUrl);
                    isPlayingAudio = false;
                    resolve(); // Hata olsa bile devam et
                };
                
                // Ses hazır olduğunda çal
                audio.addEventListener('canplaythrough', async () => {
                    try {
                        await audio.play();
                        console.log(`▶️ ${speakerName} sesi çalınıyor...`);
                    } catch (e) {
                        console.error(`❌ Ses oynatma hatası (${speakerName}):`, e);
                        isPlayingAudio = false;
                        resolve(); // Hata olsa bile devam et
                    }
                }, { once: true });
                
                // Timeout ekle (30 saniye sonra devam et)
                setTimeout(() => {
                    if (isPlayingAudio) {
                        console.warn(`⏰ ${speakerName} sesi timeout, devam ediliyor...`);
                        audio.pause();
                        URL.revokeObjectURL(audioUrl);
                        isPlayingAudio = false;
                        resolve();
                    }
                }, 30000);
                
                audio.load();
            });
            
            // Ses bittikten sonra bir sonrakine geç
            playAudioQueue(queue);
        } else {
            console.error(`❌ TTS API hatası: ${audioResponse.status}`);
            isPlayingAudio = false;
            playAudioQueue(queue);
        }
    } catch (e) {
        console.error(`❌ TTS istek hatası:`, e);
        isPlayingAudio = false;
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
            // Mikrofon izni kontrolü (mediaDevices API kontrolü ile)
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                try {
                    await navigator.mediaDevices.getUserMedia({ audio: true });
                } catch (error) {
                    alert('Mikrofon izni gerekli. Lütfen tarayıcı ayarlarından mikrofon iznini verin.');
                    console.error('Mikrofon izni hatası:', error);
                    return;
                }
            } else {
                // mediaDevices API yoksa (HTTP bağlantısı veya eski tarayıcı)
                console.warn('mediaDevices API mevcut değil. HTTPS kullanmanız önerilir.');
                // Yine de devam et, bazı tarayıcılar Speech Recognition'ı çalıştırabilir
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