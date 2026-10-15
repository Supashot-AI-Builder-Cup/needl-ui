export async function writeClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // Fallback for browsers or frames without the async clipboard API.
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    try {
      document.execCommand('copy')
    } catch {
      // Nothing else to try.
    }
    ta.remove()
  }
}

/** Throws when the browser blocks clipboard reads. */
export function readClipboard(): Promise<string> {
  return navigator.clipboard.readText()
}
