import os,json
from playwright.sync_api import sync_playwright
url=os.environ.get('TEST_URL','http://127.0.0.1:3002')
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1440,'height':1000})
 errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('dialog',lambda d:d.accept())
 page.goto(url)
 page.wait_for_selector('.day')
 page.locator('[data-autostart]').click()
 assert page.locator('#timer-start').is_disabled()
 page.evaluate("const s=JSON.parse(localStorage.getItem('pathwork-v1'));s.activeTimer.startedAt-=65000;localStorage.setItem('pathwork-v1',JSON.stringify(s))")
 page.reload()
 page.wait_for_selector('#active-timer:not([hidden])')
 page.locator('#open-running').click()
 assert page.locator('#timer-clock').inner_text().startswith('00:01:')
 page.locator('#timer-stop').click()
 assert page.locator('#timer-start').is_enabled()
 page.locator('#manual-minutes').fill('25')
 page.locator('#manual-time button').click()
 assert page.locator('#timer-clock').inner_text().startswith('00:26:')
 page.locator('#timer-finish').click()
 assert page.locator('[data-check="w1-1"]').is_checked()
 page.locator('[data-view="dashboard"]').click()
 assert '26 dk' in page.locator('.dashboard-stat').first.inner_text()
 # Import the user-provided migration fixture only if explicitly available.
 fixture=os.environ.get('IMPORT_FIXTURE')
 if fixture:
  page.locator('#import').set_input_files(fixture)
  page.wait_for_timeout(150)
  assert page.locator('.history-list article').count()==16
  assert '8 sa 22 dk' in page.locator('.dashboard-stat').first.inner_text()
  page.locator('#import').set_input_files(fixture)
  page.wait_for_timeout(150)
  assert page.locator('.history-list article').count()==16
  assert '8 sa 22 dk' in page.locator('.dashboard-stat').first.inner_text()
  state=page.evaluate("JSON.parse(localStorage.getItem('pathwork-v1'))")
  assert sum(s['seconds'] for s in state['sessions'] if s['id'].startswith('import-'))==476*60
 page.screenshot(path='/tmp/pathwork-dashboard.png',full_page=True)
 page.set_viewport_size({'width':390,'height':844})
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 page.locator('[data-view="week"]').click()
 page.locator('[data-task]').first.click()
 assert page.locator('#timer-start').is_visible()
 page.screenshot(path='/tmp/pathwork-timer.png',full_page=True)
 assert not errors,errors
 browser.close()
 print('PASS: auto-start, refresh recovery, pause, manual time, finish, dashboard, repeated merge, mobile; no browser errors.')
