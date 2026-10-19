# Pathwork

Türkçe, JSON tabanlı 12 haftalık kişisel öğrenme ve çalışma takip sayfası.

## Çalıştırma

Node.js 20 veya üzeri gerekir. Harici npm bağımlılığı yoktur.

```sh
cd /workspace/problemSet
npm start
```

Sunucu 3000 portunda başlar; `PORT=4000 npm start` ile değiştirilebilir. HTML, CSS, JS ve JSON dosyaları herhangi bir statik sunucuda da çalışır. Dosyayı `file://` ile açmak yerine HTTP sunucusu kullanın.

## Program

Her hafta 12 oturum, toplam 8 saat (molalar hariç):

| Gün | Oturumlar | Süre |
| --- | --- | --- |
| Pazartesi | JavaScript + web security video | 70 dk |
| Salı | LeetCode | 40 dk |
| Çarşamba | JavaScript + web security video | 70 dk |
| Perşembe | LeetCode + veri yapıları video | 70 dk |
| Cuma | JavaScript + web security video | 70 dk |
| Cumartesi | LeetCode + güvenlik labı | 100 dk |
| Pazar | ML video + kod | 60 dk |

İlk 4 hafta temeller, sonraki 4 hafta uygulama, son 4 hafta derinleşme. Her görev bir süre sınırı, açıklama, kaynak ve çalışma adımları içerir. Süreler hedeftir; zor bir problemi bitirmek zorunda değilsiniz. Çalışma bloğunu tamamlayıp yaklaşımı ve açık soruları not edebilirsiniz. Bir gün kaçarsa haftayı uzatın; görevleri sonraki güne yığmayın.

## İçerik düzenleme

`data/roadmap.json` tek müfredat kaynağıdır. `weeks` içinde her haftanın `id`, `title`, `focus`, `phase` ve `tasks` alanları vardır. Her görev: `id`, `category`, `day` (0=Pazartesi), `title`, `minutes`, `description`, `url`, `resourceLabel`, `steps`.

Kategori değerleri: `js`, `leetcode`, `security`, `lab`, `ds`, `ml`. Notları korumak için mevcut görev kimliklerini değiştirmeyin. Hafta seçimi ve yedek doğrulaması bu sürümde 12 haftaya göre tasarlanmıştır.

LeetCode bağlantıları problem sayfalarına, güvenlik kaynakları PortSwigger Academy konu/lab sayfalarına gider. Video kaynakları konuya özel YouTube aramalarıdır; belirli bir videonun kalite veya erişim kontrolü yapılmış değildir. Bazı lablar hesap gerektirebilir. ML pratiği için kendi Python notebook ortamınızı kullanın; site kod çalıştırmaz.

## İlerleme ve yedekler

Görev durumları, görev notları, haftalık notlar ve seçilen hafta `localStorage` içindeki `pathwork-v1` anahtarında tutulur. Hesap, sunucuda veri saklama ve otomatik cihaz senkronizasyonu yoktur. Tarayıcı verilerini silmek kayıtları kaldırır. Not defterinden **Yedeği indir** ile JSON alın, diğer cihazda **Yedekten geri yükle** ile içeri aktarın. İçe aktarma, onaydan sonra mevcut kayıtla birleştirilir: tamamlamalar korunur, farklı notlar eklenir, aynı kimlikli süre kayıtları çoğaltılmaz. Önceki kayıt `pathwork-v1-before-import` anahtarında yedeklenir. Müfredat ve kişisel ilerleme ayrı JSON yapılarıdır.

## Kontroller

```sh
npm test
# Sunucu çalışırken; Python Playwright ve Chromium kurulu ortamda:
python tests/browser_smoke.py
```

Veri testi 12 hafta, 144 benzersiz oturum, kategori başına gün dağılımı ve günlük süre sınırlarını kontrol eder. Tarayıcı testi tamamlama, not kalıcılığı, filtreler, hafta geçişi, metnin güvenli görüntülenmesi, yedekleme, mobil taşma ve diyalogları kontrol eder. Test yeni ve geçici bir tarayıcı profili kullanır.

## GitHub Pages

`main` dalına push yapıldığında `.github/workflows/pages.yml` testleri çalıştırır ve yalnızca statik site dosyalarını GitHub Pages'e gönderir. GitHub deposunda **Settings → Pages → Source → GitHub Actions** seçili olmalıdır. Yayın adresi: `https://lordgrimx.github.io/problemSet/`. Göreli kaynak yolları depo alt yolunu destekler.


## Sayaç ve dashboard

- **Çalışmaya başla** görev penceresini açarken sayacı otomatik başlatır. Görev ayrıntısını açmak tek başına süre başlatmaz.
- **Başlat** sayacı başlatır; **Durdur** süreyi kaydeder; **Bitir** süreyi kaydedip görevi tamamlar. Tek bir sayaç çalışır. Diğer göreve geçişte onayla önceki sayaç durdurulur.
- Sayaç zaman damgasıyla tutulur: sayfa yenilense, sekme arka plana alınsa veya tarayıcı kapansa da süre işler. Mola verirken Durdur kullanılmalıdır. Görev süre hedefi aşılınca sayaç otomatik kesilmez.
- Manuel olarak geçmiş bir tarihe 1–1440 dakika eklenebilir. Görev otomatik tamamlanmaz. Yanlış kayıt dashboard’dan silinebilir.
- Dashboard toplam süre, bugün, son 7 gün, kategori dağılımı, haftalık tamamlama ve geçmiş çalışmaları gösterir. Tarihler Europe/Istanbul saat dilimindedir. Gece yarısını geçen sayaç kaydı günlere bölünür.
- Yedek indirmek aktif sayacı durdurup kaydeder. Eski v1 yedekleri desteklenir. İçe aktarılan aktif sayaç otomatik sürdürülmez; kaydedilmiş oturumlar taşınır.
- `history` alanı eski Sites görevlerini özgün başlık ve tarihle korur. Aynı görevin yeni planda karşılığı varsa `mappedTaskId` ile bağlanır. Eski ve yeni hafta numaraları ayrı tutulur. Kişisel geçmiş verileri uygulama kaynak koduna dahil edilmez.

Ek kontroller:

```sh
TEST_URL=http://127.0.0.1:3000 python tests/browser_smoke.py
TEST_URL=http://127.0.0.1:3000 python tests/timer_browser.py
```

Sayaç testleri yeniden yükleme, durdurma, manuel süre, bitirme ve mobil dashboard’u doğrular. Birim testleri eski yedek geçişi, gece yarısı ayrımı, yinelenmeyen birleştirme ve geçersiz süre reddini kapsar.
