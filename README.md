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

Görev durumları, görev notları, haftalık notlar ve seçilen hafta `localStorage` içindeki `pathwork-v1` anahtarında tutulur. Hesap, sunucuda veri saklama ve otomatik cihaz senkronizasyonu yoktur. Tarayıcı verilerini silmek kayıtları kaldırır. Not defterinden **Yedeği indir** ile JSON alın, diğer cihazda **Yedekten geri yükle** ile içeri aktarın. Geri yükleme, onaydan sonra mevcut kaydın yerini alır. Müfredat ve kişisel ilerleme ayrı JSON yapılarıdır.

## Kontroller

```sh
npm test
# Sunucu çalışırken; Python Playwright ve Chromium kurulu ortamda:
python tests/browser_smoke.py
```

Veri testi 12 hafta, 144 benzersiz oturum, kategori başına gün dağılımı ve günlük süre sınırlarını kontrol eder. Tarayıcı testi tamamlama, not kalıcılığı, filtreler, hafta geçişi, metnin güvenli görüntülenmesi, yedekleme, mobil taşma ve diyalogları kontrol eder. Test yeni ve geçici bir tarayıcı profili kullanır.

## GitHub Pages

`main` dalına push yapıldığında `.github/workflows/pages.yml` testleri çalıştırır ve yalnızca statik site dosyalarını GitHub Pages'e gönderir. GitHub deposunda **Settings → Pages → Source → GitHub Actions** seçili olmalıdır. Yayın adresi: `https://lordgrimx.github.io/problemSet/`. Göreli kaynak yolları depo alt yolunu destekler.
