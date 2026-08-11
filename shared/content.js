export const deck = {
  meta: {
    company: 'SustainOne',
    presentedAs: 'SustainOne — Yatırımcı Sunumu',
  },
  slides: [
    {
      id: 'cover',
      kind: 'cover',
      eyebrow: 'SustainOne — Yatırımcı Sunumu',
      title: 'SustainOne',
      subtitle: 'KURUMSAL ESG YÖNETİMİ İÇİN TEK PLATFORM',
      body: 'Şirketlerin sürdürülebilirlik verisini toplama, izleme ve raporlama sürecini tek dijital altyapıda birleştiriyoruz.',
    },
    {
      id: 'regulation',
      kind: 'timeline',
      title: 'Sustain One’a Götüren Yolculuk',
      intro: 'Türkiye’de düzenleme takvimi ve banka zorunluluğu aynı anda hizalandı. Bir trend değil, takvim.',
      milestones: [
        {
          date: 'Ara 2023 – Oca 2024',
          label: 'TSRS Yürürlükte',
          detail: 'KGK, ESRS ile uyumlu ulusal çerçeveyi yayımladı; kapsamdaki firmalar TSRS’ye uygun raporlamakla yükümlü.',
        },
        {
          date: '2026',
          label: 'Bağımsız Güvence Denetimi',
          detail: 'TSRS raporu artık beyan değil, denetlenen belge — kanıt bağlantısı ve versiyon kilidi zorunlu hale geliyor.',
        },
        {
          date: 'Oca 2026',
          label: 'SKDM (CBAM) Kesin Raporlama',
          detail: 'Enerji, Alüminyum, Hidrojen, Demir-Çelik, Çimento, Gübre firmaları için raporlama zorunlu hale getirildi.',
        },
        {
          date: '2026–29',
          label: 'Yeşil Taksonomi & Yeşil Varlık Oranı',
          detail: 'HMB’nin planı kredi portföyünde karbon izlemeyi beklenti hâline getiriyor; bankalar GAR raporlayacak.',
        },
      ],
    },
    {
      id: 'solution',
      kind: 'steps',
      title: 'Sürdürülebilirlik verisini üretildiği yerden karar verildiği yere taşıyoruz.',
      steps: [
        {
          n: '01',
          label: 'Rehberli veri girişi',
          detail: 'ESG mevzuatını bilmeyen kullanıcı için kapsam kapsam yönlendirme: hangi veri, nereden, neden. Fatura ve doküman yükleme ile tüketim/maliyet aynı kayıttan çıkar.',
        },
        {
          n: '02',
          label: 'Sürekli ESG paneli',
          detail: 'Çevre, sosyal ve yönetişim verisi tek panelde. Yıl/ay bazında kapsam kırılımı, önceki döneme göre kıyas. Yıllık rapor değil, canlı durum.',
        },
        {
          n: '03',
          label: 'Otomatik raporlama',
          detail: 'GRI/ESRS/TSRS eşlemeli rapor çıktısı, tek tıkla PDF. Manuel şablon doldurma ortadan kalkar.',
        },
        {
          n: '04',
          label: 'Karar konsolu',
          detail: 'Banka, yatırımcı ya da iç yönetim için değişmez, kanıta bağlı bir görünüm — belirli bir ana ait, sonradan değiştirilemeyen snapshot.',
        },
      ],
    },
    {
      id: 'problem',
      kind: 'cards',
      title: 'ESG yönetimi hâlâ Excel ve e-posta arasında sıkışmış durumda.',
      cards: [
        { label: 'Veri dağınık', detail: 'Kapsam 1-2-3 emisyon, sosyal ve yönetişim verileri farklı departmanlarda, farklı dosyalarda tutuluyor.' },
        { label: 'Manuel süreç', detail: 'Veri toplama e-posta zincirleri ve Excel şablonlarıyla yürüyor; hata ve gecikme riski yüksek.' },
        { label: 'Uzmanlık eksikliği', detail: 'Şirketlerin çoğunda TSRS, CSRD, SKDM gibi mevzuatı yorumlayacak iç ESG uzmanlığı yok.' },
        { label: 'Denetlenebilirlik yok', detail: '2026’dan itibaren TSRS raporları bağımsız güvence denetimine tabi; Excel süreçleri kanıt izi bırakmıyor.' },
      ],
      footer: 'Mevzuat baskısı büyüyor; şirketlerin çoğunun buna hazırlanacak altyapısı yok.',
    },
    {
      id: 'modules',
      kind: 'cards',
      title: 'Altı modül, uçtan uca çalışan tek platform.',
      intro: 'Modüller uçtan uca gezilebilir durumda; veri katmanı şu an gerçek entegrasyona geçiş aşamasında.',
      cards: [
        { label: 'Çevre & Karbon', detail: 'Kapsam 1-2-3 emisyon takibi, dönemsel kıyaslama; fatura yükleme ile tüketim/maliyet takibi.' },
        { label: 'Sosyal', detail: 'Çalışan hakları, İSG, eğitim, çeşitlilik, tedarik zinciri sosyal performansı.' },
        { label: 'Yönetişim', detail: 'Ortak ve sektöre özel politika kütüphanesi; sürdürülebilirlik komitesi kurma akışı.' },
        { label: 'Raporlama', detail: 'GRI/ESRS eşleme, PDF çıktı. TSRS eşlemesi yol haritasında.' },
        { label: 'Finansman & Karar Konsolu', detail: 'Değişmez snapshot; banka/yatırımcı tarafında liste, inceleme, durum yönetimi.' },
      ],
    },
    {
      id: 'revenue',
      kind: 'cards',
      title: 'Gelir Modeli',
      cards: [
        { label: 'Portal Satışı', detail: 'Firmaların platform kullanım bedeli.' },
        { label: 'Portal Lisansı', detail: 'Yıllık lisanslama bedeli.' },
        { label: 'Yeni Müşteri Komisyonu', detail: 'Bankalara sağlanan yeşil müşteri üzerinden fiyatlama; işletme verilerinin bankalara satışı.' },
      ],
    },
    {
      id: 'costs',
      kind: 'costs',
      title: 'Gider Yapısı',
      summary: [
        { label: 'Personel Maliyeti', value: '8.061.300 TL' },
        { label: 'Diğer Gider Kalemleri', value: '3.240.000 TL' },
        { label: 'Toplam İlk Yatırım (Yıllık)', value: '11.301.300 TL' },
      ],
      detailColumns: ['Gider Kalemi', 'Aylık', '12 Aylık'],
      detailRows: [
        ['Kurucu – işveren maliyeti', '243.500 TL', '2.922.000 TL'],
        ['Junior – işveren maliyeti', '85.225 TL', '1.022.700 TL'],
        ['Müşteri Deneyimi – işveren maliyeti', '73.050 TL', '876.600 TL'],
        ['Freelance IT – 8 gün/ay', '192.000 TL', '2.304.000 TL'],
        ['Freelance Çevre Mühendisi – 2 gün/ay', '48.000 TL', '576.000 TL'],
        ['3 Sigortalı Çalışan – Yemek', '30.000 TL', '360.000 TL'],
        ['Cloud / Sunucu / Hosting', '25.000 TL', '300.000 TL'],
        ['Yazılım & SaaS araçları', '20.000 TL', '240.000 TL'],
        ['Pazarlama + Etkinlik / Fuar', '100.000 TL', '1.200.000 TL'],
        ['Hukuk / Freelance danışmanlık', '60.000 TL', '720.000 TL'],
        ['Mali Müşavir', '40.000 TL', '480.000 TL'],
        ['3 adet bilgisayar', '—', '120.000 TL'],
        ['TOPLAM', '931.775 TL', '11.301.300 TL'],
      ],
    },
    {
      id: 'whynow',
      kind: 'why',
      title: 'Neden SustainOne, neden şimdi.',
      blocks: [
        { q: 'Neden bu şirket?', a: 'Türkiye mevzuatına ve kurumsal/banka sürecine yerel olarak inşa edilen tek platform.' },
        { q: 'Neden şimdi?', a: 'TSRS güvence denetimi, SKDM kesin rejimi ve Yeşil Varlık Oranı raporlaması aynı anda devrede.' },
        { q: 'Neden bu ekip?', a: 'Kurucu ESG/sürdürülebilirlik alanında uzman; ürün ve iş geliştirmeyi birlikte yürütüyor.' },
        { q: 'Neden yatırım?', a: 'Çalışan bir ürün, net bir pazar boşluğu ve şeffaf, gerçekçi bir finansal model.' },
      ],
      footer: 'SustainOne · Yatırımcı Sunumu · Ağustos 2026',
    },
  ],
};
