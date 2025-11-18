import os
import json
import uvicorn
import httpx
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import Response
from pydantic import BaseModel
from dotenv import load_dotenv

# prompts.py dosyasından senaryo fonksiyonunu çekiyoruz
from prompts import get_system_prompt

# 1. Ayarları Yükle
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")

if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY eksik! .env dosyasını kontrol et.")

# Gemini API'yi yapılandır
genai.configure(api_key=GOOGLE_API_KEY)

# 2. Uygulama Ayarları
app = FastAPI(title="Business Deutsch Sim Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Veri Modelleri
class SimulationRequest(BaseModel):
    user_message: str
    history: list = []
    scenario_id: str = "crisis" # Varsayılan senaryo
    members: list = ["Thomas", "Sarah", "Mark", "Lukas"] # Seçilen ekip üyeleri

class TTSRequest(BaseModel):
    text: str
    speaker: str

# 4. Ses Eşleştirmesi (ElevenLabs Voice ID'leri)
VOICE_MAP = {
    "Thomas": "ErXwobaYiN019PkySvjV", # Antoni (Otoriter Erkek)
    "Sarah": "EXAVITQu4vr4xnSDxMaL",  # Bella (Net Kadın)
    "Mark": "TxGEqnHWrfWFTfGW9XjX",   # Josh (Yumuşak Erkek)
    "Lukas": "pNInz6obpgDQGcFmaJgB",  # Adam (Bavyera lehçesi için uygun erkek sesi)
    "System": "21m00Tcm4TlvDq8ikWAM"  # Rachel
}

# --- ENDPOINTLER ---

@app.post("/simulate")
async def run_simulation(request: SimulationRequest):
    try:
        # 1. Seçilen senaryoya göre özel "System Prompt"u al
        system_instruction = get_system_prompt(request.scenario_id, request.members)
        
        # 2. Modeli o anki senaryo ile anlık oluştur (Dinamik Beyin)
        model = genai.GenerativeModel(
            'models/gemini-2.5-flash', 
            system_instruction=system_instruction,
            generation_config={"response_mime_type": "application/json"}
        )

        # 3. Sohbeti başlat
        chat = model.start_chat(history=request.history)
        response = chat.send_message(request.user_message)
        
        # 4. Temizlik (Markdown formatını kaldır)
        text_response = response.text.replace("```json", "").replace("```", "").strip()
        
        # 5. Response'u parse et ve sadece seçilen karakterlerin konuşmasını filtrele
        parsed_response = json.loads(text_response)
        
        # Seçilen karakterlerin listesi (normalize edilmiş)
        allowed_speakers = {member.strip().lower() for member in request.members}
        
        # Response'lardaki speaker'ları filtrele
        if "responses" in parsed_response:
            filtered_responses = []
            for resp in parsed_response["responses"]:
                speaker = resp.get("speaker", "").strip()
                speaker_normalized = speaker.lower()
                
                # Eğer speaker seçilen listede varsa ekle
                if speaker_normalized in allowed_speakers:
                    # Speaker adını orijinal formatta koru (ilk harf büyük)
                    resp["speaker"] = next((m for m in request.members if m.lower() == speaker_normalized), speaker)
                    filtered_responses.append(resp)
                else:
                    print(f"⚠️ Filtrelenen speaker: '{speaker}' (Seçilen: {request.members})")
            
            # Eğer hiç geçerli response yoksa veya yanlış karakter konuştuysa
            if len(filtered_responses) == 0:
                # İlk seçilen karakteri kullan ve AI'ya tekrar sorma
                first_member = request.members[0]
                print(f"⚠️ Yanlış karakter konuştu, {first_member} kullanılıyor")
                filtered_responses = [{
                    "speaker": first_member,
                    "mood": "neutral",
                    "text": f"Hallo! Ich bin {first_member}. Wie kann ich dir helfen?"
                }]
            
            parsed_response["responses"] = filtered_responses
        
        return parsed_response

    except Exception as e:
        print(f"Gemini Hata: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/tts")
async def text_to_speech(request: TTSRequest):
    try:
        # Ses ID'sini bul
        voice_id = VOICE_MAP.get(request.speaker, VOICE_MAP["System"])
        
        # OPTİMİZASYON 1: Gecikmeyi düşür (latency=3 denge için iyidir)
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}?optimize_streaming_latency=3"
        
        headers = {
            "xi-api-key": ELEVENLABS_API_KEY,
            "Content-Type": "application/json"
        }
        
        # OPTİMİZASYON 2: Sesin başı kesilmesin diye padding ekle (" ... ")
        safe_text = " ... " + request.text

        # Karaktere göre ses ayarları
        voice_settings = {
            "stability": 0.5,
            "similarity_boost": 0.7
        }
        
        # Sarah için: Daha hızlı ve net konuşma (stability düşük = daha hızlı)
        if request.speaker == "Sarah":
            voice_settings = {
                "stability": 0.3,  # Daha düşük = daha hızlı ve dinamik
                "similarity_boost": 0.8  # Yüksek = daha net
            }
        # Mark için: Daha casual ve rahat konuşma
        elif request.speaker == "Mark":
            voice_settings = {
                "stability": 0.6,  # Biraz daha yüksek = daha rahat
                "similarity_boost": 0.65  # Biraz daha düşük = daha casual
            }
        # Lukas için: Bavyera lehçesi için özel ayar
        elif request.speaker == "Lukas":
            voice_settings = {
                "stability": 0.55,  # Orta seviye
                "similarity_boost": 0.75  # Yüksek = daha karakteristik
            }
        
        payload = {
            "text": safe_text,
            "model_id": "eleven_turbo_v2_5", # En hızlı ve Almanca destekli model
            "voice_settings": voice_settings
        }

        # OPTİMİZASYON 3: Mac SSL Hatası için verify=False
        async with httpx.AsyncClient(verify=False) as client:
            response = await client.post(url, json=payload, headers=headers)
            
            if response.status_code != 200:
                print(f"ElevenLabs Hata: {response.text}")
                raise HTTPException(status_code=500, detail="Ses servisi hatası")
            
            print(f"🔊 Ses alındı: {request.speaker} ({len(response.content)} bytes)")
            return Response(content=response.content, media_type="audio/mpeg")

    except Exception as e:
        print(f"TTS Hata: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Statik dosyalar (Frontend'i sunmak için en altta olmalı)
app.mount("/", StaticFiles(directory="web", html=True), name="static")

if __name__ == "__main__":
    # reload=False yaparak çökme sorununu engelliyoruz
    uvicorn.run(app, host="0.0.0.0", port=8000)