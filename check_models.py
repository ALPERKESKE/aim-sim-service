import google.generativeai as genai
import os
from dotenv import load_dotenv

# API Anahtarını yükle
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

print("\n🔍 API Anahtarınızla erişebileceğiniz modeller taranıyor...\n")
print("-" * 50)

try:
    found_any = False
    for m in genai.list_models():
        # Sadece metin üretebilen (generateContent) modelleri göster
        if 'generateContent' in m.supported_generation_methods:
            print(f"✅ {m.name}")
            found_any = True
    
    if not found_any:
        print("❌ Hiçbir model bulunamadı. API anahtarınızda veya internette sorun olabilir.")

except Exception as e:
    print(f"HATA OLUŞTU: {str(e)}")

print("-" * 50)