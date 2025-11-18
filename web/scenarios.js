// ai-sim-service/web/scenarios.js

export const SCENARIO_INFO = {
    "ci_cd_fail": {
        title: "CI/CD Pipeline Hatası",
        desc: "Test aşamasında pipeline kırıldı. Ekip çözüm bekliyor.",
        hints: [
            "Sorunun 'Unit Test' kaynaklı olduğunu belirt.",
            "Hatalı kodu tespit ettiğini söyle.",
            "Düzeltmeyi (Fix) gönderdiğini ve yeniden build başlattığını ekle.",
            "Test sonuçlarını kontrol ettiğini belirt.",
            "CI/CD loglarını incelediğini söyle.",
            "Build süresini kısaltmak için öneride bulun.",
            "Ekip ile iletişim halinde olduğunu belirt."
        ],
        keywords: ["Pipeline", "Fehlschlag", "Unit Test", "beheben", "Build", "Deployment", "Log", "Fehler"],
        exampleSentences: [
            "Ich habe den Fehler in den Unit Tests gefunden.",
            "Der Build ist fehlgeschlagen, aber ich habe das Problem bereits behoben.",
            "Ich habe einen Fix committed und den Build neu gestartet.",
            "Kannst du bitte die Logs überprüfen?",
            "Die Tests laufen jetzt durch."
        ]
    },
    "k8s_scaling": {
        title: "Kubernetes Scaling",
        desc: "Site yavaşladı, podlar yetersiz kalıyor.",
        hints: [
            "Trafik artışını fark ettiğini söyle.",
            "HPA (Horizontal Pod Autoscaler) ayarlarını kontrol et.",
            "Maksimum pod sayısını artırmayı öner.",
            "CPU ve Memory metriklerini analiz et.",
            "Auto-scaling kurallarını gözden geçir.",
            "Resource limits'leri kontrol et.",
            "Performans testleri yapmayı öner."
        ],
        keywords: ["Skalierung", "Last", "Ressourcen", "erhöhen", "Pod", "HPA", "CPU", "Memory", "Metriken"],
        exampleSentences: [
            "Die Last ist deutlich gestiegen, wir brauchen mehr Pods.",
            "Ich habe die HPA-Konfiguration überprüft.",
            "Wir sollten die maximale Pod-Anzahl erhöhen.",
            "Die CPU-Auslastung liegt bei 90 Prozent.",
            "Können wir die Ressourcen anpassen?"
        ]
    },
    "docker_size": {
        title: "Docker Optimizasyonu",
        desc: "Image boyutu çok büyük, deploy yavaş.",
        hints: [
            "Gereksiz dosyaların silinmesi gerektiğini söyle.",
            "'Multi-stage build' kullanmayı öner.",
            "Base image'ı 'Alpine' ile değiştirmeyi teklif et.",
            ".dockerignore dosyasını kontrol et.",
            "Layer caching'i optimize et.",
            "Gereksiz dependencies'leri kaldır.",
            "Image boyutunu ölç ve raporla."
        ],
        keywords: ["Image-Größe", "reduzieren", "Schlank", "Beschleunigen", "Multi-stage", "Alpine", "Layer", "Optimierung"],
        exampleSentences: [
            "Das Docker-Image ist zu groß, wir müssen es optimieren.",
            "Ich schlage vor, Multi-stage Builds zu verwenden.",
            "Wir können auf Alpine Linux umsteigen.",
            "Die Image-Größe ist von 2GB auf 500MB gesunken.",
            "Lass uns die .dockerignore-Datei überprüfen."
        ]
    },
    "security_patch": {
        title: "Güvenlik Yaması",
        desc: "Kritik bir güvenlik açığı (Vulnerability) bulundu.",
        hints: [
            "Panik yapma, durumun kontrol altında olduğunu hissettir.",
            "Etkilenen servisleri listelediğini söyle.",
            "Yamayı (Patch) bu gece uygulayacağını belirt.",
            "Risk seviyesini değerlendir.",
            "Yedekleme (Backup) yapıldığını belirt.",
            "Test ortamında önce dene.",
            "Ekip ile koordinasyon sağla."
        ],
        keywords: ["Sicherheitslücke", "Patch", "einspielen", "Risiko", "Vulnerability", "Sicherheit", "Update", "Kritisch"],
        exampleSentences: [
            "Wir haben eine kritische Sicherheitslücke gefunden.",
            "Ich habe alle betroffenen Services identifiziert.",
            "Der Patch wird heute Nacht eingespielt.",
            "Das Risiko ist hoch, aber wir haben es unter Kontrolle.",
            "Wir sollten zuerst im Test-Environment testen."
        ]
    },
    "cloud_cost": {
        title: "Bulut Maliyetleri",
        desc: "AWS faturası bu ay çok yüksek geldi.",
        hints: [
            "Gereksiz açık kalan sunucuları (Idle Instances) bulduğunu söyle.",
            "Otomatik kapatma scripti yazacağını belirt.",
            "Maliyeti %20 düşürebileceğini vaat et.",
            "Reserved Instances kullanmayı öner.",
            "Spot Instances için uygun iş yüklerini belirle.",
            "Cost monitoring araçlarını kur.",
            "Aylık maliyet raporu hazırla."
        ],
        keywords: ["Kosten", "optimieren", "Budget", "Einsparen", "Instances", "AWS", "Faktura", "Ressourcen"],
        exampleSentences: [
            "Die AWS-Rechnung ist diesen Monat deutlich höher.",
            "Ich habe mehrere idle Instances gefunden.",
            "Wir können die Kosten um etwa 20 Prozent reduzieren.",
            "Lass uns Reserved Instances in Betracht ziehen.",
            "Wir sollten ein automatisches Shutdown-Script implementieren."
        ]
    },
    "terraform_state": {
        title: "Terraform State Kilidi",
        desc: "Terraform apply çalışmıyor, state kilitli.",
        hints: [
            "Bir önceki işlemin yarıda kaldığını açıkla.",
            "DynamoDB üzerinden kilidi manuel kaldıracağını söyle.",
            "Ekibe 'Force Unlock' yapmamaları gerektiğini hatırlat.",
            "State dosyasını kontrol et.",
            "Backend konfigürasyonunu gözden geçir.",
            "Lock ID'yi doğrula.",
            "State'i yedekle."
        ],
        keywords: ["Sperre", "manuell", "lösen", "Zustand", "Terraform", "State", "Lock", "DynamoDB"],
        exampleSentences: [
            "Der Terraform State ist gesperrt.",
            "Ich werde die Sperre manuell in DynamoDB entfernen.",
            "Bitte verwendet kein Force Unlock ohne Rücksprache.",
            "Der vorherige Prozess wurde unterbrochen.",
            "Lass uns zuerst den State-Status überprüfen."
        ]
    },
    "monitoring_alert": {
        title: "Alarm Yorgunluğu",
        desc: "Gece boyu sürekli yanlış alarmlar geldi.",
        hints: [
            "Alarmların çok hassas ayarlandığını kabul et.",
            "Eşik değerini (Threshold) yükselteceğini söyle.",
            "Sadece kritik durumlarda uyarı gelmesi gerektiğini savun.",
            "Alert routing kurallarını gözden geçir.",
            "False positive'leri filtrele.",
            "Alert gruplama (Grouping) yap.",
            "On-call ekibini rahatlat."
        ],
        keywords: ["Fehlalarm", "Schwellenwert", "anpassen", "Ruhe", "Alert", "Monitoring", "Threshold", "Benachrichtigung"],
        exampleSentences: [
            "Wir haben die ganze Nacht Fehlalarme bekommen.",
            "Die Schwellenwerte sind zu niedrig eingestellt.",
            "Wir sollten nur bei kritischen Problemen benachrichtigt werden.",
            "Lass uns die Alert-Regeln überarbeiten.",
            "Die Alarmmüdigkeit ist ein echtes Problem."
        ]
    },
    "db_migration": {
        title: "DB Migrasyonu",
        desc: "Canlı sistemde veritabanı değişikliği yapılacak.",
        hints: [
            "Kesinti olmaması (Zero-downtime) gerektiğini vurgula.",
            "Blue-Green deployment stratejisini öner.",
            "Yedek (Backup) almadan işlem yapmayacağını söyle.",
            "Rollback planı hazırla.",
            "Migration script'ini test ortamında çalıştır.",
            "Veri bütünlüğünü kontrol et.",
            "Maintenance window belirle."
        ],
        keywords: ["Migration", "Ausfallzeit", "Strategie", "Backup", "Datenbank", "Schema", "Rollback", "Zero-downtime"],
        exampleSentences: [
            "Wir müssen eine Datenbank-Migration durchführen.",
            "Zero-downtime ist wichtig für uns.",
            "Ich schlage eine Blue-Green-Strategie vor.",
            "Wir haben ein vollständiges Backup erstellt.",
            "Der Rollback-Plan ist vorbereitet."
        ]
    },
    "incident_postmortem": {
        title: "Post-Mortem Analizi",
        desc: "Dünkü kesintiyi ekibe açıklıyorsun.",
        hints: [
            "Suçlayıcı olma, sürece odaklan (Blameless).",
            "Kök nedeni (Root Cause) bulduğunu söyle.",
            "Bunun tekrar yaşanmaması için alınacak önlemi anlat.",
            "Timeline oluştur.",
            "Etkilenen sistemleri liste.",
            "Action items belirle.",
            "Dokümantasyonu güncelle."
        ],
        keywords: ["Ursache", "Vermeiden", "Lerneffekt", "Ausfall", "Incident", "Analyse", "Root Cause", "Prävention"],
        exampleSentences: [
            "Lass uns eine Blameless Post-Mortem-Analyse durchführen.",
            "Die Root Cause war ein Konfigurationsfehler.",
            "Wir haben Maßnahmen ergriffen, um dies zu vermeiden.",
            "Der Ausfall dauerte etwa 30 Minuten.",
            "Wir sollten unsere Prozesse verbessern."
        ]
    },
    "junior_onboarding": {
        title: "Junior Eğitimi",
        desc: "Yeni başlayan arkadaş Git akışını karıştırmış.",
        hints: [
            "Nazik ve destekleyici ol.",
            "Master branch'e direkt commit atılmayacağını anlat.",
            "Pull Request (PR) açması gerektiğini söyle.",
            "Git Flow'u adım adım açıkla.",
            "Code review sürecini anlat.",
            "Best practices paylaş.",
            "Sorularını teşvik et."
        ],
        keywords: ["Erklären", "Branch", "Regel", "Unterstützen", "Git", "Pull Request", "Code Review", "Best Practices"],
        exampleSentences: [
            "Keine Sorge, das passiert jedem am Anfang.",
            "Bitte erstelle einen Feature-Branch für deine Änderungen.",
            "Öffne einen Pull Request, damit wir den Code reviewen können.",
            "Wir verwenden Git Flow als Branching-Strategie.",
            "Falls du Fragen hast, frag einfach!"
        ]
    }
};
