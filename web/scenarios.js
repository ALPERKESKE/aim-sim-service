// ai-sim-service/web/scenarios.js

export const SCENARIO_INFO = {
    "ci_cd_fail": {
        title: "CI/CD Pipeline Hatası",
        desc: "Test aşamasında pipeline kırıldı. Ekip çözüm bekliyor.",
        hints: [
            "Sorunun 'Unit Test' kaynaklı olduğunu belirt.",
            "Hatalı kodu tespit ettiğini söyle.",
            "Düzeltmeyi (Fix) gönderdiğini ve yeniden build başlattığını ekle."
        ],
        keywords: ["Pipeline", "Fehlschlag", "Unit Test", "beheben"]
    },
    "k8s_scaling": {
        title: "Kubernetes Scaling",
        desc: "Site yavaşladı, podlar yetersiz kalıyor.",
        hints: [
            "Trafik artışını fark ettiğini söyle.",
            "HPA (Horizontal Pod Autoscaler) ayarlarını kontrol et.",
            "Maksimum pod sayısını artırmayı öner."
        ],
        keywords: ["Skalierung", "Last", "Ressourcen", "erhöhen"]
    },
    "docker_size": {
        title: "Docker Optimizasyonu",
        desc: "Image boyutu çok büyük, deploy yavaş.",
        hints: [
            "Gereksiz dosyaların silinmesi gerektiğini söyle.",
            "'Multi-stage build' kullanmayı öner.",
            "Base image'ı 'Alpine' ile değiştirmeyi teklif et."
        ],
        keywords: ["Image-Größe", "reduzieren", "Schlank", "Beschleunigen"]
    },
    "security_patch": {
        title: "Güvenlik Yaması",
        desc: "Kritik bir güvenlik açığı (Vulnerability) bulundu.",
        hints: [
            "Panik yapma, durumun kontrol altında olduğunu hissettir.",
            "Etkilenen servisleri listelediğini söyle.",
            "Yamayı (Patch) bu gece uygulayacağını belirt."
        ],
        keywords: ["Sicherheitslücke", "Patch", "einspielen", "Risiko"]
    },
    "cloud_cost": {
        title: "Bulut Maliyetleri",
        desc: "AWS faturası bu ay çok yüksek geldi.",
        hints: [
            "Gereksiz açık kalan sunucuları (Idle Instances) bulduğunu söyle.",
            "Otomatik kapatma scripti yazacağını belirt.",
            "Maliyeti %20 düşürebileceğini vaat et."
        ],
        keywords: ["Kosten", "optimieren", "Budget", "Einsparen"]
    },
    "terraform_state": {
        title: "Terraform State Kilidi",
        desc: "Terraform apply çalışmıyor, state kilitli.",
        hints: [
            "Bir önceki işlemin yarıda kaldığını açıkla.",
            "DynamoDB üzerinden kilidi manuel kaldıracağını söyle.",
            "Ekibe 'Force Unlock' yapmamaları gerektiğini hatırlat."
        ],
        keywords: ["Sperre", "manuell", "lösen", "Zustand"]
    },
    "monitoring_alert": {
        title: "Alarm Yorgunluğu",
        desc: "Gece boyu sürekli yanlış alarmlar geldi.",
        hints: [
            "Alarmların çok hassas ayarlandığını kabul et.",
            "Eşik değerini (Threshold) yükselteceğini söyle.",
            "Sadece kritik durumlarda uyarı gelmesi gerektiğini savun."
        ],
        keywords: ["Fehlalarm", "Schwellenwert", "anpassen", "Ruhe"]
    },
    "db_migration": {
        title: "DB Migrasyonu",
        desc: "Canlı sistemde veritabanı değişikliği yapılacak.",
        hints: [
            "Kesinti olmaması (Zero-downtime) gerektiğini vurgula.",
            "Blue-Green deployment stratejisini öner.",
            "Yedek (Backup) almadan işlem yapmayacağını söyle."
        ],
        keywords: ["Migration", "Ausfallzeit", "Strategie", "Backup"]
    },
    "incident_postmortem": {
        title: "Post-Mortem Analizi",
        desc: "Dünkü kesintiyi ekibe açıklıyorsun.",
        hints: [
            "Suçlayıcı olma, sürece odaklan (Blameless).",
            "Kök nedeni (Root Cause) bulduğunu söyle.",
            "Bunun tekrar yaşanmaması için alınacak önlemi anlat."
        ],
        keywords: ["Ursache", "Vermeiden", "Lerneffekt", "Ausfall"]
    },
    "junior_onboarding": {
        "title": "Junior Eğitimi",
        "desc": "Yeni başlayan arkadaş Git akışını karıştırmış.",
        "hints": [
            "Nazik ve destekleyici ol.",
            "Master branch'e direkt commit atılmayacağını anlat.",
            "Pull Request (PR) açması gerektiğini söyle."
        ],
        "keywords": ["Erklären", "Branch", "Regel", "Unterstützen"]
    }
};