const TOUCH_CONTROLS = 'a[href], button, summary, label:has(input:is([type="radio"], [type="checkbox"])), [role="button"], [role="tab"]';

export function installTouchControlEvents(root) {
  const touchPointer = matchMedia('(any-pointer: coarse)');
  function suppressTouchControlMenu(event) {
    const isTouch = event.pointerType === 'touch' || event.sourceCapabilities?.firesTouchEvents;
    if (!isTouch && !touchPointer.matches && !document.documentElement.classList.contains('native-app')) return;
    if (event.target?.closest?.(TOUCH_CONTROLS)) event.preventDefault();
  }
  root.addEventListener('contextmenu', suppressTouchControlMenu);
  root.addEventListener('dragstart', suppressTouchControlMenu);
}
