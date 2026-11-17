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
    assert page.get_by_text('Chào QA!', exact=False).count() > 0
    results.append('Onboarding completion -> app shell transition')

    # More hub and Safe Zone: test that an unselected location cannot save.
    page.locator('a[href="#/more"]').click()
    page.locator('.more-hub a[href="#/safe-zones"]').click()
    page.locator('[data-action="modal-zone"]').first.click()
    page.locator('input[name="name"]').fill('QA Zone')
    page.locator('#zone-form button[type="submit"]').click()
    page.wait_for_timeout(80)
    assert page.get_by_text('Hãy tìm hoặc chọn một vị trí trên bản đồ trước khi lưu.', exact=False).count() > 0
    assert page.get_by_text('Chưa có vùng an toàn nào', exact=False).count() == 0 or page.locator('.zone-card').count() == 0
    page.locator('.modal-head [data-action="modal-close"]').click()
    page.locator('[data-action="modal-zone"]').first.click()
    page.locator('input[name="name"]').fill('QA Zone')
    page.locator('#zone-place-search').fill('Trường ABC')
    page.locator('[data-action="zone-search"]').click()
    page.locator('[data-zone-result="0"]').wait_for(timeout=4000)
    page.locator('[data-zone-result="0"]').click()
    page.locator('#zone-radius-range').fill('350')
    page.locator('#zone-form button[type="submit"]').click()
    page.get_by_text('QA Zone', exact=True).wait_for(timeout=4000)
    results.append('Safe Zone search -> place selection -> radius -> save; blank-coordinate guard')

    # Location screen remains view-only, with no Safe Zone CRUD actions.
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
    page.locator('.intro-actions [data-action="modal-task"]').click()
    assert page.locator('#reminder-time-wrap').is_hidden()
    page.locator('input[name="reminderEnabled"]').check()
    assert page.locator('#reminder-time-wrap').is_visible()
    page.locator('select[name="repeat"]').select_option('weekly')
    assert page.locator('#task-weekday-wrap').is_visible()
    page.locator('.weekday-chip input[name="weekday"]').first.check()
    page.locator('input[name="title"]').fill('QA weekly task')
    page.locator('#task-form button[type="submit"]').click()
    page.get_by_text('QA weekly task', exact=True).wait_for(timeout=4000)
    results.append('Growth conditional reminder and weekly weekday controls')

    # SOS cannot be duplicated while active or acknowledged.
    page.locator('.mobile-nav a[href="#/sos"]').click()
    page.locator('[data-action="sos-confirm"]').click()
    page.locator('[data-action="sos-trigger"]').click()
    page.get_by_text('Đang có một sự kiện SOS chưa xử lý', exact=False).wait_for(timeout=4000)
    assert page.locator('[data-action="sos-confirm"]').count() == 0
    page.locator('[data-action^="sos-ack:"]').click()
    assert page.get_by_text('Bạn đã xác nhận SOS', exact=False).count() > 0
    assert page.locator('[data-action="sos-confirm"]').count() == 0
    page.locator('[data-action^="sos-resolve:"]').first.click()
    page.wait_for_timeout(200)
    assert page.locator('[data-action="sos-confirm"]').count() == 1
    results.append('SOS two-step activation, duplicate guard, acknowledge and resolve')

    # Dedicated support destinations and discoverability.
    page.locator('a[href="#/home"]').click()
    page.locator('.support-entry-card[href="#/sfai"]').first.wait_for(timeout=3000)
    page.locator('.support-entry-card[href="#/sfai"]').first.click()
    page.get_by_role('heading', name='S.F AI', exact=True).wait_for(timeout=3000)
    assert page.locator('#sfai-form').count() == 1
    assert page.get_by_text('không phải nhân viên trực tuyến', exact=False).count() > 0
    prompt = page.locator('[data-sfai-prompt]').first
    prompt.click()
    assert page.locator('#sfai-form input[name="question"]').input_value() != ''
    results.append('Home S.F AI entry -> dedicated assistant route -> prompt fills composer')
    page.locator('a[href="#/more"]').click()
    page.locator('.support-entry-card--hub[href="#/sfai"]').wait_for(timeout=3000)
    page.locator('.more-hub a[href="#/help"]').click()
    page.get_by_role('heading', name='Câu hỏi thường gặp', exact=True).wait_for(timeout=3000)
    assert page.locator('#faq-search').count() == 1
    assert page.locator('#sfai-form').count() == 0
    page.locator('#faq-search').fill('vi tri')
    page.wait_for_timeout(100)
    page.locator('a[href="#/sfai"]').last.wait_for(timeout=3000)
    results.append('FAQ remains independent, searchable and links to S.F AI without embedding chat')

    # Core route mobile geometry: no horizontal overflow and final content scrolls above fixed nav.
    for route in ['#/home', '#/location', '#/sos', '#/growth', '#/more', '#/sfai', '#/help']:
      page.goto('http://127.0.0.1:4173/' + route, wait_until='domcontentloaded')
      page.wait_for_timeout(100)
      for width,height in [(320,780),(360,800),(375,812),(390,844),(430,932)]:
        page.set_viewport_size({'width':width,'height':height})
        page.wait_for_timeout(50)
        metrics=page.evaluate('''() => {
          const nav=document.querySelector('.mobile-nav');
          const wrap=document.querySelector('.page-wrap');
          return {viewport:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,
            nav:nav?{top:nav.getBoundingClientRect().top,height:nav.getBoundingClientRect().height}:null,
            last:wrap?.lastElementChild?{bottom:wrap.lastElementChild.getBoundingClientRect().bottom}:null};
        }''')
        assert metrics['scroll'] <= metrics['viewport'], f'overflow {route} at {width}px: {metrics}'
        page.evaluate('window.scrollTo(0,document.documentElement.scrollHeight)')
        page.wait_for_timeout(30)
        bottom=page.evaluate('''() => {
          const nav=document.querySelector('.mobile-nav'), wrap=document.querySelector('.page-wrap');
          return nav&&wrap?.lastElementChild ? wrap.lastElementChild.getBoundingClientRect().bottom <= nav.getBoundingClientRect().top + 1 : true;
        }''')
        assert bottom, f'Bottom nav overlaps final content {route} at {width}px'
      page.set_viewport_size({'width':390,'height':844})
      page.screenshot(path=str(SCREENSHOTS/f'redesign-{route[2:].replace("/", "-") or "home"}-390.png'),full_page=True)
    results.append('Mobile route geometry matrix: 7 routes × 5 phone widths; overflow and final-content/nav clearance')

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
  print(f'E2E FAILED/BLOCKED: {e}', file=sys.stderr)
  if errors: print('Page errors: ' + '; '.join(errors), file=sys.stderr)
  if console_errors: print('Console errors: ' + '; '.join(console_errors[:15]), file=sys.stderr)
  sys.exit(1)

print('E2E PASSED')
for item in results: print(' - ' + item)
print(f'Screenshots saved: {len(list(SCREENSHOTS.glob("v7-*.png")))}')
