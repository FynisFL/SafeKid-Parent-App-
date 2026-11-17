from playwright.sync_api import sync_playwright
from pathlib import Path
import json, sys, time

ROOT = Path(__file__).resolve().parents[1]
SCREENSHOTS = ROOT / 'screenshots'
SCREENSHOTS.mkdir(exist_ok=True)
errors = []
console_errors = []
results = []

MAPLIBRE_MOCK = r'''(() => {
  class MockMap {
    constructor(options) {
      this.container = options.container;
      this.events = {};
      this.sources = {};
      this.container.innerHTML = '<div class="mock-map-surface" aria-label="Test-only map fixture">Map fixture · test only</div>';
      this.container.classList.add('maplibregl-map');
      this.container.addEventListener('click', (event) => {
        if (event.target.closest('.zone-map-marker')) return;
        (this.events.click || []).forEach(fn => fn({ lngLat: { lng: 106.69, lat: 10.77 } }));
      });
      setTimeout(() => (this.events.load || []).forEach(fn => fn()), 30);
    }
    addControl() { return this; }
    on(name, fn) { (this.events[name] ||= []).push(fn); return this; }
    addSource(name, source) { this.sources[name] = { ...source, setData(data) { this.data = data; } }; return this; }
    getSource(name) { return this.sources[name]; }
    addLayer() { return this; }
    flyTo() { return this; }
    resize() { return this; }
    remove() { this.container.innerHTML = ''; }
  }
  class MockMarker {
    constructor(options = {}) { this.element = options.element || document.createElement('div'); this.listeners = {}; this.pos = { lng: 106.69, lat: 10.77 }; }
    setLngLat(pair) { this.pos = { lng: pair[0], lat: pair[1] }; return this; }
    getLngLat() { return this.pos; }
    setPopup() { return this; }
    addTo(map) { map.container.appendChild(this.element); return this; }
    on(name, fn) { this.listeners[name] = fn; return this; }
  }
  class MockPopup { setText() { return this; } }
  window.maplibregl = { Map: MockMap, Marker: MockMarker, Popup: MockPopup,
    NavigationControl: class {}, ScaleControl: class {} };
})();'''

try:
  with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, args=['--no-sandbox', '--disable-dev-shm-usage', '--no-proxy-server'])
    context = browser.new_context(viewport={'width':390, 'height':844}, device_scale_factor=1, is_mobile=True, has_touch=True)
    context.add_init_script(MAPLIBRE_MOCK)
    # Device emulation has no OS keyboard. Simulate its visual viewport resize.
    context.add_init_script("""(() => {
      const viewport=window.visualViewport;
      if(!viewport)return;
      const height=Object.getOwnPropertyDescriptor(VisualViewport.prototype,'height').get;
      Object.defineProperty(viewport,'height',{get(){
        const textEntry=document.activeElement?.matches('input[type=text],input:not([type]),textarea');
        return height.call(viewport)-(textEntry&&window.qaKeyboardEnabled?260:0);
      }});
      for(const event of ['focusin','focusout'])
        document.addEventListener(event,()=>requestAnimationFrame(()=>viewport.dispatchEvent(new Event('resize'))));
    })();""")
    page = context.new_page()
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.on('console', lambda m: console_errors.append(m.text) if m.type == 'error' else None)
    page.route('https://api.maptiler.com/geocoding/**', lambda route: route.fulfill(status=200, content_type='application/json', body=json.dumps({
      'type':'FeatureCollection','features':[{'type':'Feature','place_name':'Trường ABC, Thành phố Hồ Chí Minh','text':'Trường ABC','geometry':{'type':'Point','coordinates':[106.69,10.77]},'properties':{'name':'Trường ABC'}}]
    })))
    page.goto('http://127.0.0.1:4173', wait_until='domcontentloaded', timeout=10000)
    page.wait_for_selector('#onboarding-form', timeout=8000)
    assert page.locator('.app-shell').count() == 0, 'First-run must not render App Shell'
    assert page.locator('.mobile-nav').count() == 0, 'First-run must not render navigation'
    assert page.locator('input[name="parentName"]').is_visible(), 'Parent name must be visible immediately'
    assert page.locator('button[type="submit"]').is_visible(), 'Setup CTA must be visible immediately'
    onboarding_geometry = page.evaluate('''() => { const f=document.querySelector('#onboarding-form'); const r=f.getBoundingClientRect(); return {top:r.top,bottom:r.bottom,viewport:innerHeight,scrollHeight:document.documentElement.scrollHeight}; }''')
    assert onboarding_geometry['top'] >= 0 and onboarding_geometry['top'] < onboarding_geometry['viewport'], onboarding_geometry
    results.append('P0 onboarding shell isolation + above-the-fold form')
    page.screenshot(path=str(SCREENSHOTS/'v7-onboarding-390.png'), full_page=True)

    # Mobile responsive screenshot matrix for first-run and post-setup home.
    for width, height in [(320,640),(360,800),(375,812),(390,844),(430,932),(767,900)]:
      page.set_viewport_size({'width':width,'height':height})
      page.wait_for_timeout(80)
      metrics = page.evaluate('''() => ({viewport:document.documentElement.clientWidth, scroll:document.documentElement.scrollWidth, form:!!document.querySelector('#onboarding-form'), nav:!!document.querySelector('.mobile-nav')})''')
      assert metrics['scroll'] <= metrics['viewport'], f'onboarding horizontal overflow at {width}px: {metrics}'
      assert metrics['form'] and not metrics['nav'], f'first-run flow isolation at {width}px: {metrics}'
      page.screenshot(path=str(SCREENSHOTS/f'v7-onboarding-{width}.png'), full_page=True)
    results.append('Onboarding overflow/layout viewport matrix 320, 360, 375, 390, 430, 767px')

    page.set_viewport_size({'width':390,'height':844})
    page.locator('input[name="parentName"]').fill('QA Parent')
    page.locator('input[name="childName"]').fill('QA Child')
    page.locator('#onboarding-form button[type="submit"]').click()
    page.wait_for_selector('.app-shell', timeout=5000)
    assert page.locator('.mobile-nav').count() == 1
    assert page.get_by_text('Chào Parent!', exact=True).count() == 1, 'Vietnamese greeting uses the final name in the parent profile'
    results.append('Onboarding completion -> app shell transition')

    # More hub and Safe Zone: test that an unselected location cannot save.
    page.evaluate("window.safeKidTestNav = document.querySelector('.mobile-nav')")
    page.locator('.mobile-nav a[href="#/more"]').click()
    page.locator('.more-hub a[href="#/safe-zones"]').click()
    page.locator('[data-action="modal-zone"]').first.click()
    page.locator('input[name="name"]').fill('QA Zone')
    page.locator('button[type="submit"][form="zone-form"]').click()
    page.get_by_text('Hãy tìm hoặc chọn một vị trí trên bản đồ trước khi lưu.', exact=False).wait_for(timeout=5000)
    assert page.get_by_text('Chưa có vùng an toàn nào', exact=False).count() == 0 or page.locator('.zone-card').count() == 0
    page.locator('.modal-head [data-action="modal-close"]').click()
    page.locator('[data-action="modal-zone"]').first.click()
    page.locator('input[name="name"]').fill('QA Zone')
    page.locator('#zone-place-search').fill('Trường ABC')
    page.locator('[data-action="zone-search"]').click()
    page.locator('[data-zone-result="0"]').wait_for(timeout=4000)
    page.locator('[data-zone-result="0"]').click()
    page.locator('#zone-radius-range').fill('350')
    page.locator('button[type="submit"][form="zone-form"]').click()
    page.get_by_text('QA Zone', exact=True).wait_for(timeout=4000)
    results.append('Safe Zone search -> place selection -> radius -> save; blank-coordinate guard')

    # Location screen remains view-only, with no Safe Zone CRUD actions.
    assert page.evaluate("window.safeKidTestNav === document.querySelector('.mobile-nav')"), 'Navigation node must persist between routes'
    page.locator('.mobile-nav a[href="#/location"]').click()
    page.get_by_text('Bản đồ chỉ hiển thị', exact=True).wait_for(timeout=3000)
    assert page.locator('[data-action="modal-zone"]').count() == 0
    assert page.locator('[data-action^="zone-edit:"]').count() == 0
    assert page.locator('[data-action^="zone-delete:"]').count() == 0
    assert page.locator('a[href="#/safe-zones"]').count() > 0
    results.append('Location map read-only invariant')
    page.screenshot(path=str(SCREENSHOTS/'v7-location-390.png'), full_page=True)

    # Settings jump must open accordion without changing router route.
    page.locator('a[href="#/more"]').click()
    page.locator('.more-hub a[href="#/profile"]').click()
    assert page.url.endswith('#/profile')
    page.locator('[data-scroll-target="settings-notifications"]').click()
    assert page.url.endswith('#/profile'), f'Settings shortcut changed route: {page.url}'
    assert page.locator('#settings-notifications').evaluate('(el)=>el.open')
    results.append('Settings hub anchors stay inside profile route')

    # Growth form conditional UI.
    page.locator('.mobile-nav a[href="#/growth"]').click()
    page.set_viewport_size({'width':390,'height':560})
    page.locator('.intro-actions [data-action="modal-task"]').click()
    page.evaluate('window.qaKeyboardEnabled = true')
    page.locator('input[name="title"]').focus()
    page.wait_for_function("document.querySelector('.app-shell')?.classList.contains('keyboard-open')")
    keyboard_state = page.evaluate("""() => {const nav=document.querySelector('.mobile-nav');return {width:innerWidth,mobile:matchMedia('(max-width: 767px)').matches,active:document.activeElement?.outerHTML?.slice(0,180),shell:document.querySelector('.app-shell')?.className,focused:document.activeElement?.getAttribute('name'),navDisplay:nav?getComputedStyle(nav).display:null,navParent:nav?.parentElement?.className,styles:[...document.styleSheets].map(s=>({href:s.href,keyboardRule:(()=>{try{return [...s.cssRules].some(r=>r.selectorText==='.app-shell.keyboard-open .mobile-nav')}catch{return 'blocked'}})()}))};}""")
    assert 'keyboard-open' in (keyboard_state['shell'] or ''), f'Task form focus must activate keyboard shell state: {keyboard_state}'
    assert not page.locator('.mobile-nav').is_visible(), f'Bottom navigation must be hidden while task form input is focused: {keyboard_state}'
    submit_rect = page.locator('button[type="submit"][form="task-form"]').evaluate("(el) => ({bottom:el.getBoundingClientRect().bottom,visible:!!(el.offsetWidth||el.offsetHeight||el.getClientRects().length)})")
    assert submit_rect['visible'] and submit_rect['bottom'] <= 300, f'Task submit action must remain inside keyboard-visible viewport: {submit_rect}'
    page.evaluate('window.qaKeyboardEnabled = false')
    page.set_viewport_size({'width':390,'height':844})
    assert page.locator('#reminder-time-wrap').is_hidden()
    page.locator('input[name="reminderEnabled"]').check()
    assert page.locator('#reminder-time-wrap').is_visible()
    page.locator('select[name="repeat"]').select_option('weekly')
    assert page.locator('#task-weekday-wrap').is_visible()
    weekday_index = page.evaluate("() => (new Date().getDay() + 6) % 7")
    page.locator('.weekday-chip input[name="weekday"]').nth(weekday_index).check()
    page.locator('input[name="title"]').fill('QA weekly task')
    page.locator('button[type="submit"][form="task-form"]').click()
    page.get_by_text('QA weekly task', exact=True).wait_for(timeout=4000)
    results.append('Growth conditional reminder and weekly weekday controls')

    # SOS cannot be duplicated while active or acknowledged.
    page.locator('.mobile-nav a[href="#/sos"]').click()
    page.locator('[data-action="sos-confirm"]').click()
    page.locator('[data-action="sos-trigger"]').click()
    page.get_by_text('Đang có một sự kiện SOS chưa xử lý', exact=False).wait_for(timeout=4000)
    assert page.locator('[data-action="sos-confirm"]').count() == 0
    page.locator('[data-action^="sos-ack:"]').first.click()
    page.get_by_text('Bạn đã xác nhận SOS', exact=False).wait_for(timeout=3000)
    assert page.locator('[data-action="sos-confirm"]').count() == 0, 'Acknowledged SOS must remain open'
    page.locator('[data-action^="sos-resolve:"]').first.click()
    page.locator('[data-action="sos-confirm"]').wait_for(state='visible',timeout=3000)
    assert page.locator('[data-action="sos-confirm"]').count() == 1, 'Resolving SOS should return to idle activation state'
    results.append('SOS two-step activation, duplicate guard, acknowledge and resolve')

    # Dedicated support destinations and discoverability.
    page.locator('.mobile-nav a[href="#/home"]').click()
    page.locator('.support-entry-card[href="#/sfai"]').first.wait_for(timeout=3000)
    page.locator('.support-entry-card[href="#/sfai"]').first.click()
    page.get_by_role('heading', name='S.F AI', exact=True).wait_for(timeout=3000)
    assert page.locator('#sfai-form').count() == 1
    assert page.locator('.sfai-disclosure').is_visible(), 'S.F AI limitation disclosure must be visible above the conversation'
    assert page.get_by_text('không phải nhân viên trực tuyến', exact=False).count() > 0
    prompt = page.locator('[data-sfai-prompt]').first
    page.evaluate('window.qaKeyboardEnabled = true')
    prompt.click()
    page.wait_for_function("document.querySelector('.app-shell')?.classList.contains('keyboard-open')")
    assert page.locator('#sfai-form input[name="question"]').input_value() != ''
    assert page.locator('.app-shell').evaluate("(el) => el.classList.contains('keyboard-open')"), 'Text focus must activate keyboard shell state'
    assert not page.locator('.mobile-nav').is_visible(), 'Bottom navigation must yield space while a mobile text field is focused'
    page.locator('#sfai-form input[name="question"]').evaluate('(el) => el.blur()')
    page.wait_for_function("!document.querySelector('.app-shell')?.classList.contains('keyboard-open')")
    assert page.locator('.mobile-nav').is_visible(), 'Bottom navigation must return after text focus ends'
    results.append('Home S.F AI entry -> dedicated assistant route -> prompt fills composer; keyboard shell hides/restores nav')
    page.locator('a[href="#/more"]').click()
    page.locator('.support-entry-card--hub[href="#/sfai"]').wait_for(timeout=3000)
    page.locator('.more-hub a[href="#/help"]').click()
    page.get_by_role('heading', name='Câu hỏi thường gặp', exact=True).wait_for(timeout=3000)
    assert page.locator('#faq-search').count() == 1
    assert page.locator('#sfai-form').count() == 0
    assert page.locator('[data-faq-category]').count() >= 6, 'FAQ should expose categories from approved Markdown headings'
    page.locator('#faq-search').fill('vi tri')
    page.wait_for_timeout(100)
    assert page.locator('.faq-item').count() > 0, 'Accent-insensitive FAQ search for "vi tri" should find the approved position FAQ'
    faq_count = int(page.locator('#faq-count').inner_text().split()[0])
    assert 0 < faq_count < 30, f'FAQ result count should reflect filtered results, got {faq_count}'
    page.locator('[data-faq-category="SOS"]').click()
    assert page.locator('[data-faq-category="SOS"]').get_attribute('aria-pressed') == 'true'
    assert page.locator('.faq-item').count() > 0, 'SOS topic should expose approved SOS FAQ entries'
    page.locator('[data-faq-category="all"]').click()
    page.locator('a[href="#/sfai"]').last.wait_for(timeout=3000)
    results.append('FAQ remains independent, searchable and links to S.F AI without embedding chat')

    # Create a real device through the UI so the detail route has populated cards.
    page.goto('http://127.0.0.1:4173/#/watch-passport', wait_until='domcontentloaded')
    page.locator('.page-intro [data-action="modal-device"]').click()
    page.locator('#device-form [name="displayName"]').fill('Đồng hồ của bé')
    page.locator('#device-form [name="serialOrDeviceCode"]').fill('SAFEKID-' + '1234567890' * 6)
    page.locator('button[form="device-form"][type="submit"]').click()
    page.wait_for_timeout(500)
    page.locator('.device-card [data-action^="device-detail:"]').wait_for(timeout=5000)
    page.locator('.device-card [data-action^="device-detail:"]').click()
    page.wait_for_url(lambda url: '#/watch-passport-detail?device=' in url)
    device_route = '#' + page.url.split('#', 1)[1]
    page.reload()
    page.locator('.device-detail-grid').wait_for()
    page.locator('[data-action^="modal-accessory:"]').click()
    page.locator('#accessory-form').wait_for()
    page.go_back()
    page.locator('.modal-backdrop').wait_for(state='detached')
    page.locator('.device-grid').wait_for()

    popup_cases = [
      ('#/safe-zones', 'modal-zone'), ('#/contacts', 'modal-contact'),
      ('#/growth', 'modal-task'), ('#/growth', 'modal-habit'),
      ('#/watch-passport', 'modal-device'), (device_route, 'modal-maintenance:'),
      (device_route, 'modal-accessory:'), (device_route, 'modal-data:'),
      (device_route, 'modal-document:'), ('#/sos', 'sos-confirm'),
    ]
    for width, height in [(320, 568), (390, 844)]:
      page.set_viewport_size({'width':width,'height':height})
      for route, action in popup_cases:
        page.goto('http://127.0.0.1:4173/' + route, wait_until='domcontentloaded')
        page.locator(f'[data-action^="{action}"]').first.click()
        dialog = page.locator('.modal-backdrop:not([inert]) .modal')
        dialog.wait_for()
        dialog.locator(':scope > .modal-actions').wait_for()
        page.wait_for_timeout(230)
        bounds = dialog.evaluate("""el => {
          const box=el.getBoundingClientRect(), footer=el.querySelector(':scope > .modal-actions');
          return {left:box.left,right:box.right,top:box.top,bottom:box.bottom,
            footer:footer.getBoundingClientRect().bottom, viewport:innerHeight};
        }""")
        assert bounds['left'] >= 0 and bounds['right'] <= width and bounds['top'] >= 0 and bounds['bottom'] <= height and bounds['footer'] <= height, (route,action,width,bounds)
        dialog.locator('.modal-head [data-action="modal-close"]').click()
        dialog.wait_for(state='detached')
    results.append('Ten popup entry points checked at two mobile sizes')

    routes = [
      '#/home', '#/location', '#/safe-zones', '#/sos', '#/alerts', '#/contacts',
      '#/growth', '#/growth/habits', '#/growth/calendar', '#/growth/progress', '#/growth/coins',
      '#/watch-passport', device_route, '#/more', '#/sfai', '#/help', '#/plans',
      '#/profile', '#/settings', '#/permissions',
    ]
    for route in routes:
      page.goto('http://127.0.0.1:4173/' + route, wait_until='domcontentloaded')
      page.wait_for_timeout(500)
      if route == '#/plans':
        assert page.locator('.plan-free').is_visible() and page.locator('.plan-plus').is_visible(), 'Free and planned Plus cards must both be visible'
        assert page.get_by_text('Không khóa SOS và Safe Zone cơ bản', exact=True).count() == 1, 'Core safety must remain Free'
        assert page.locator('.plan-footer-plus').get_by_text('Chưa mở bán', exact=False).count() == 1, 'Plus must remain clearly marked as not for sale'
        assert page.locator('.plan-footer-plus').get_by_text('Không có thanh toán trong ứng dụng', exact=True).count() == 1, 'No checkout/payment must be implied'
        assert page.locator('.plan-plus button').count() == 0, 'No fake Plus purchase CTA may appear'
        results.append('Plans Free/Plus transparency: core safety remains Free; Plus is planned with no checkout')
      for width,height in [(320,720),(320,780),(360,800),(375,812),(390,844),(430,932)]:
        page.set_viewport_size({'width':width,'height':height})
        page.wait_for_timeout(50)
        if route == '#/home':
          labels = page.locator('.mobile-quick-actions a b').all_text_contents()
          label_state = page.locator('.mobile-quick-actions a b').evaluate_all("els => els.map(el => ({text:el.textContent.trim(),whiteSpace:getComputedStyle(el).whiteSpace,scrollWidth:el.scrollWidth,clientWidth:el.clientWidth}))")
          assert len(labels) == 4 and all(x['whiteSpace'] == 'normal' for x in label_state), f'Home quick-action labels must wrap, not clip: {label_state}'
          hierarchy = page.evaluate("""() => {const box=s=>document.querySelector(s)?.getBoundingClientRect();return {location:box('.location-feature')?.top,quick:box('.mobile-quick-actions')?.top,support:box('.support-entry-card')?.top,hero:document.querySelector('.family-hero') ? getComputedStyle(document.querySelector('.family-hero')).display : 'none',date:document.querySelector('.intro-date')?.textContent.trim(),dateFont:getComputedStyle(document.querySelector('.intro-date')).fontSize};}""")
          assert hierarchy['location'] < hierarchy['quick'] < hierarchy['support'] and hierarchy['hero'] == 'none', f'Home must prioritize parent GPS status and actions over decoration: {hierarchy}'
          assert hierarchy['date'] and hierarchy['dateFont'] != '0px', f'Home date label must be readable: {hierarchy}'
        if route == '#/growth':
          tabs = page.locator('.tabbar a').evaluate_all("els => els.map(el => ({width:el.offsetWidth,height:el.offsetHeight}))")
          assert len(tabs) == 5 and all(x['height'] >= 44 for x in tabs), f'Growth tabs must keep usable touch targets at {width}px: {tabs}'
        metrics=page.evaluate('''() => {
          const nav=document.querySelector('.mobile-nav');
          const wrap=document.querySelector('.page-wrap');
          const links=[...(nav?.querySelectorAll('a')||[])];
          return {viewport:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,
            nav:nav?{top:nav.getBoundingClientRect().top,bottom:nav.getBoundingClientRect().bottom,height:nav.getBoundingClientRect().height}:null,
            links:links.map(a=>({height:a.getBoundingClientRect().height,label:a.innerText.trim(),active:a.getAttribute('aria-current')})),
            last:wrap?.lastElementChild?{bottom:wrap.lastElementChild.getBoundingClientRect().bottom}:null};
        }''')
        assert metrics['scroll'] <= metrics['viewport'], f'overflow {route} at {width}px: {metrics}'
        assert metrics['nav'] and metrics['nav']['bottom'] <= height, f'nav outside viewport {route} at {width}px: {metrics}'
        if route == '#/sfai':
          composer = page.locator('#sfai-form').evaluate("el => {const r=el.getBoundingClientRect();return {top:r.top,bottom:r.bottom,height:r.height,ancestors:[el,el.parentElement,el.parentElement.parentElement,el.closest('.main-area'),el.closest('.app-shell')].map(n=>({cls:n.className,position:getComputedStyle(n).position,transform:getComputedStyle(n).transform,filter:getComputedStyle(n).filter,contain:getComputedStyle(n).contain,backdrop:getComputedStyle(n).backdropFilter}))};}")
          nav_top = page.locator('.mobile-nav').evaluate("el => el.getBoundingClientRect().top")
          assert composer['height'] >= 48 and composer['bottom'] <= nav_top + 1 and composer['bottom'] <= height, f'S.F AI composer must remain visible above bottom navigation at {width}px: composer={composer}, navTop={nav_top}, viewport={height}'
        assert len(metrics['links']) == 5 and all(x['height'] >= 44 and x['label'] for x in metrics['links']), f'five labelled touch targets required: {metrics}'
        assert sum(1 for x in metrics['links'] if x['active'] == 'page') == 1, f'exactly one active route must be announced: {metrics}'
        page.evaluate('window.scrollTo(0,document.documentElement.scrollHeight)')
        page.wait_for_timeout(30)
        bottom=page.evaluate('''() => {
          const nav=document.querySelector('.mobile-nav'), wrap=document.querySelector('.page-wrap');
          return nav&&wrap?.lastElementChild ? wrap.lastElementChild.getBoundingClientRect().bottom <= nav.getBoundingClientRect().top + 1 : true;
        }''')
        assert bottom, f'Bottom nav overlaps final content {route} at {width}px'
      page.set_viewport_size({'width':390,'height':844})
      page.wait_for_timeout(500)
      page.evaluate('window.scrollTo(0,0)')
      page.wait_for_timeout(120)
      page.screenshot(path=str(SCREENSHOTS/f'redesign-{route.split("?", 1)[0][2:].replace("/", "-") or "home"}-390-viewport.png'))
      page.screenshot(path=str(SCREENSHOTS/f'redesign-{route.split("?", 1)[0][2:].replace("/", "-") or "home"}-390.png'),full_page=True)
    results.append('Mobile route geometry matrix: 20 routes × 6 phone viewports; overflow and final-content/nav clearance')

    # Post-setup responsive pages at mobile, tablet and desktop widths.
    for width, height in [(320,780),(360,800),(390,844),(430,932),(767,900),(768,900),(1024,900),(1280,900),(1440,900),(1920,1080)]:
      page.set_viewport_size({'width':width,'height':height})
      page.wait_for_timeout(80)
      metrics = page.evaluate('''() => ({viewport:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,nav:!!document.querySelector('.mobile-nav'),body:document.body.scrollWidth})''')
      assert metrics['scroll'] <= metrics['viewport'], f'horizontal overflow at {width}px: {metrics}'
      page.screenshot(path=str(SCREENSHOTS/f'v7-sos-{width}.png'), full_page=True)
    results.append('Post-setup responsive overflow/screenshot matrix 320–1920px')

    if errors:
      raise AssertionError('Browser page errors: ' + '; '.join(errors))
    browser.close()
except Exception as e:
  import traceback
  traceback.print_exc()
  try:
    print('Failure state: ' + page.locator('body').inner_text()[-5000:], file=sys.stderr)
  except Exception:
    pass
  print(f'E2E FAILED/BLOCKED: {e}', file=sys.stderr)
  if errors: print('Page errors: ' + '; '.join(errors), file=sys.stderr)
  if console_errors: print('Console errors: ' + '; '.join(console_errors[:15]), file=sys.stderr)
  sys.exit(1)

print('E2E PASSED')
for item in results: print(' - ' + item)
print(f'Screenshots saved: {len(list(SCREENSHOTS.glob("*.png")))}')
