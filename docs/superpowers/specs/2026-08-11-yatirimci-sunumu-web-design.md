# SustainOne Yatırımcı Sunumu — Web Deck Tasarımı

## Amaç

Yatırımcıya gönderilecek düz bir PowerPoint yerine, aynı içeriği taşıyan, efektli geçişli, tam ekran slayt hissi veren bir web sunumu hazırlamak. Kullanıcı Cloudflare Pages'e kendisi deploy edecek. Aynı içerikten üç görsel olarak birbirinden belirgin şekilde farklı tema üretilecek; kullanıcı hangisini yatırımcıya göndereceğine kendisi karar verecek.

## Kaynak İçerik

`websunum.pptx` (proje kökünde, 8 slayt, Türkçe, düz Office teması — özel marka rengi yok). İçerik pptx'ten çıkarıldı, bkz. "İçerik" bölümü.

## Mimari

Build adımı olmayan, saf HTML/CSS/JS, tek Cloudflare Pages projesi:

```
/
  index.html                  → founder için 3 temayı karşılaştırma/seçim sayfası (yatırımcıya gönderilmez)
  shared/
    content.js                 → 8 slaytın tüm metni/verisi (ES module, tek kaynak)
  koyu-teknik/
    index.html
    style.css
    script.js
  acik-kurumsal/
    index.html
    style.css
    script.js
  organik-editoryal/
    index.html
    style.css
    script.js
```

- `shared/content.js` tek içerik kaynağıdır; üç tema da buradan render eder. İçerik güncellemesi tek yerden yapılır.
- Her tema klasörü kendi CSS/JS'iyle bağımsız görsel/animasyon katmanını yönetir; birbirinden tamamen farklı görünür.
- Cloudflare Pages: repo kökü "output directory" olarak verilir, build command yok (statik dosya sunumu). `/koyu-teknik/`, `/acik-kurumsal/`, `/organik-editoryal/` otomatik route olur.

## İçerik (8 slayt, sıra pptx ile aynı)

Pptx'teki anlatım sırası korunuyor: makro mevzuat baskısı → çözüm özeti → operasyonel problem → ürün modülleri → gelir → gider → kapanış.

1. **Kapak** — "SustainOne", "KURUMSAL ESG YÖNETİMİ İÇİN TEK PLATFORM", alt açıklama cümlesi, "Yatırımcı Sunumu" etiketi.
2. **Mevzuat Takvimi** ("Sustain One'a Götüren Yolculuk") — Türkiye'de düzenleme takvimi ile banka zorunluluğunun aynı anda hizalandığı anlatısı. 4 kilometre taşı kartına indirgenir (her biri: tarih + başlık + tek cümle özet): TSRS (Ara 2023–Oca 2024, yürürlükte), Bağımsız Güvence Denetimi (2026), SKDM/CBAM (Oca 2026, kesin tarih), Yeşil Ulusal Taksonomi / GAR (2026–29). Orijinal uzun paragraflar karta sığacak şekilde kısaltılır, anlam kaybı olmadan.
3. **Çözüm** — "Sürdürülebilirlik verisini üretildiği yerden karar verildiği yere taşıyoruz." 01-04 adım: Rehberli veri girişi, Sürekli ESG paneli, Otomatik raporlama, Karar konsolu.
4. **Problem** — "ESG yönetimi hâlâ Excel ve e-posta arasında sıkışmış durumda." 4 madde: Veri dağınık, Manuel süreç, Uzmanlık eksikliği, Denetlenebilirlik yok.
5. **Ürün Modülleri** — "Altı modül, uçtan uca çalışan tek platform." 6 kart: Çevre & Karbon, Sosyal, Yönetişim, Raporlama, Finansman & Karar Konsolu (+ not: "veri katmanı gerçek entegrasyona geçiş aşamasında").
6. **Gelir Modeli** — 3 kalem: Portal Satışı (kullanım bedeli), Portal Lisansı (yıllık lisanslama), Yeni Müşteri Komisyonu (bankalara sağlanan yeşil müşteri üzerinden fiyatlama + işletme verisi satışı). "Fimaların" yazım hatası "Firmaların" olarak düzeltilir.
7. **Gider Yapısı** — Özet kartlar öne çıkar: Personel Maliyeti (8.061.300 TL), Diğer Gider Kalemleri (3.240.000 TL), Toplam İlk Yatırım (11.301.300 TL yıllık). "Detayları göster" ile aylık/12 aylık kalem kalem döküm (Kurucu, Junior, Müşteri Deneyimi, Freelance IT, Freelance Çevre Mühendisi, sigortalı çalışan yemek, cloud/hosting, yazılım, pazarlama, hukuk, mali müşavir, ekipman) açılır — orijinal pptx tablosundaki tüm satırlar korunur, sadece ilk görünümde özetlenir.
8. **Neden Şimdi / Kapanış** — "Neden SustainOne, neden şimdi." 4 "neden" bloğu (şirket, zamanlama, ekip, yatırım) + "SustainOne · Yatırımcı Sunumu · Ağustos 2026" alt bilgisi.

## Navigasyon Mekaniği (üç temada ortak)

- Tam ekran slayt deneyimi: bir seferde bir slayt görünür.
- İleri/geri: sağ/sol ok tuşları, `Space`, mouse wheel / trackpad scroll (debounce'lu, bir scroll = bir slayt), touch swipe (mobil).
- Üstte ince progress bar (mevcut slayt / 8).
- Sağ altta sayaç ("3 / 8").
- Sol veya sağ kenarda tıklanabilir nav-dot'lar (istenen slayta direkt atlama).
- Slayt 7'nin "detayları göster" açılır paneli, slayt içi bir etkileşimdir; slayt geçişini tetiklemez.
- URL hash ile slayt senkronizasyonu (`#3` gibi) — sayfa yenilendiğinde veya link paylaşıldığında kaldığı yerden açılır.

## Üç Tema — Görsel Yön

### Tema 1 — Koyu Teknik (`koyu-teknik/`)
Grafit/koyu yeşil zemin, lime-neon vurgu rengi, sans + mono karışık tipografi (rakamlar/etiketler mono). Slayt geçişi: dikey wipe + hafif glitch/scanline efekti. Arka planda yavaş hareket eden ince veri-noktası/grid deseni (CSS/canvas, düşük performans maliyetli). Finansal rakamlar (slayt 6-7) sayaç (count-up) animasyonuyla belirir. Fintech/climate-SaaS dashboard hissi — teknik, veri-güvenilir izlenimi.

### Tema 2 — Açık Kurumsal (`acik-kurumsal/`)
Beyaz/kırık beyaz zemin, koyu yeşil + toprak tonları, bol boşluk, klasik kurumsal sans tipografi. Slayt geçişi: yumuşak yatay slide + fade, ince parallax katmanı. Başlıklarda underline/çizgi reveal animasyonu. En muhafazakâr izlenim — "hazır, güvenilir kurumsal rapor" hissi.

### Tema 3 — Organik Editoryal (`organik-editoryal/`)
Krem zemin, büyük editoryal serif/display tipografi, yeşil-sarı doğa paleti, yumuşak blob/organik şekiller arka planda. Slayt geçişi: büyük tipografi crossfade + renk-blok morph. Dergi/manifesto anlatımı — "dashboard" değil "hikaye".

Üç tema da aynı 8 slaytı, aynı `shared/content.js` verisinden render eder; farklılık tamamen CSS/animasyon/tipografi/layout katmanındadır.

## Seçim Sayfası (`/index.html`)

Founder'ın kendi kullanımı için: SustainOne logosu/başlığı, kısa açıklama, 3 temaya giden büyük kartlar (her kartta küçük bir önizleme/renk şeridi ve tema adı). Yatırımcıya bu sayfa değil, seçilen tema klasörünün linki gönderilir.

## Test / Doğrulama Planı

- Üç temanın her birinde 8 slaytın tamamı klavye (ok/space), scroll ve nav-dot ile geziliyor mu — manuel kontrol.
- Slayt 7 detay paneli aç/kapa çalışıyor mu.
- URL hash ile doğrudan slayta gidiş / sayfa yenileme sonrası konum korunuyor mu.
- Farklı pencere genişliklerinde (masaüstü + dar pencere) metin taşması olmadan okunabilir mi — responsive kontrol.
- Yerel bir statik sunucu (`npx serve` veya benzeri) ile üç tema da tarayıcıda gözden geçiriliyor.

## Kapsam Dışı

- Gerçek Cloudflare Pages deploy işlemi — kullanıcı kendisi yapacak.
- Build sistemi / framework (Vite, React vb.) kullanılmayacak.
- pptx dosyasının kendisi değiştirilmeyecek; sadece web versiyonu üretilecek.
