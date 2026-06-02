// plugins/arabic-to-english.ts
export default defineNuxtPlugin(() => {
    const toEnglishNumbers = (str: string) =>
      str.replace(/[\u0660-\u0669]/g, (c) => String(c.charCodeAt(0) - 0x0660))
         .replace(/[\u06f0-\u06f9]/g, (c) => String(c.charCodeAt(0) - 0x06f0))
  
    if (import.meta.client) {
      document.addEventListener('input', (e) => {
        const el = e.target as HTMLInputElement
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          const converted = toEnglishNumbers(el.value)
          if (converted !== el.value) {
            const pos = el.selectionStart
            el.value = converted
            el.setSelectionRange(pos, pos)
            el.dispatchEvent(new Event('input', { bubbles: true }))
          }
        }
      }, true)
    }
  })