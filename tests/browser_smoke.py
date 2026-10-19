from playwright.sync_api import sync_playwright
import json
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1440,'height':1050},device_scale_factor=1)
 errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:3000')
 page.wait_for_selector('.day')
 assert page.locator('.day').count()==7
 assert page.locator('[data-check]').count()==12
 page.locator('[data-check]').first.check()
 page.locator('#weekly-note').fill('Haftalık test notum')
 page.locator('[data-task="w1-1"]').first.click()
 page.locator('#task-note').fill('Çözüm notum <script>bad()</script>')
 page.locator('.close').click()
 page.reload()
 assert page.locator('[data-check]').first.is_checked()
 assert page.locator('#weekly-note').input_value()=='Haftalık test notum'
 page.locator('[data-filter="leetcode"]').click()
 assert page.locator('.task').count()==3
 page.locator('[data-view="roadmap"]').click()
 assert page.locator('.roadmap-card').count()==12
 page.locator('[data-week="12"]').click()
 assert page.locator('#next').is_disabled()
 page.locator('[data-view="notes"]').click()
 assert page.locator('.saved-note').count()==2
 assert '<script>bad()</script>' in page.locator('.saved-note').nth(1).inner_text()
 with page.expect_download() as download:
  page.locator('#notes-export').click()
 backup=download.value
 backup.save_as('/tmp/pathwork-test-backup.json')
 assert json.load(open('/tmp/pathwork-test-backup.json'))['done']['w1-1'] is True
 page.on('dialog',lambda d:d.accept())
 page.locator('#import').set_input_files('/tmp/pathwork-test-backup.json')
 page.wait_for_timeout(150)
 assert page.locator('#toast').inner_text()=='Yedek geri yüklendi.'
 page.locator('[data-view="week"]').click()
 page.locator('#week-select').select_option('1')
 page.evaluate('localStorage.clear()')
 page.reload()
 page.wait_for_selector('.day')
 page.screenshot(path='/tmp/pathwork-desktop.png',full_page=True)
 page.set_viewport_size({'width':390,'height':844})
 assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
 page.locator('[data-view="notes"]').click()
 assert page.locator('#notes-export').is_visible()
 page.locator('[data-view="week"]').click()
 page.locator('[data-task]').first.click()
 assert page.locator('#task-dialog').is_visible()
 page.locator('.close').click()
 page.screenshot(path='/tmp/pathwork-mobile.png',full_page=True)
 assert not errors,errors
 browser.close()
 print('PASS: 7 days, 12 tasks, persistence, filters, 12-week navigation, safe notes, export/import, mobile layout, dialog; no browser errors.')
