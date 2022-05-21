import { Page } from 'puppeteer'

// This injects a box into the page that moves with the mouse;
// Useful for debugging
export async function installMouseHelper(page: Page): Promise<void> {
  await page.evaluateOnNewDocument(() => {
    // Install mouse helper only for top-level frame.
    if (window !== window.parent) return
    window.addEventListener(
      'DOMContentLoaded',
      () => {
        const box = document.createElement('puppeteer-mouse-pointer')
        const styleElement = document.createElement('style')
        styleElement.innerHTML = `
        puppeteer-mouse-pointer {
          background: rgba(0,0,0,.75);
          border-radius: 10px;
          border: 1px solid black;
          height: 16px;
          left: 0;
          margin: -8px 0 0 -8px;
          padding: 0;
          pointer-events: none;
          position: absolute;
          top: 0;
          width: 16px;
          z-index: 10000;
        }
      `
        document.head.appendChild(styleElement)
        document.body.appendChild(box)
        document.addEventListener(
          'mousemove',
          (event: MouseEvent) => {
            box.style.left = `${event.pageX}px`
            box.style.top = `${event.pageY}px`
          },
          true
        )
      },
      false
    )
  })
}
