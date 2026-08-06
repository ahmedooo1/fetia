interface CardHandle {
  $el: HTMLElement
  opened: boolean
  open: () => void
}

function slugifyFilename(name: string) {
  return (
    name
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase() || 'ma-carte'
  )
}

export function useCardDownload(cardRef: Ref<CardHandle | null>) {
  const downloading = ref<'' | 'image' | 'pdf'>('')
  const downloadError = ref('')

  async function ensureOpenAndSettled() {
    const handle = cardRef.value
    if (!handle) throw new Error('Carte introuvable')
    if (!handle.opened) {
      handle.open()
      await new Promise((r) => setTimeout(r, 950))
    }
    await new Promise((r) => setTimeout(r, 60))
  }

  async function captureCanvas() {
    await ensureOpenAndSettled()
    const handle = cardRef.value
    if (!handle) throw new Error('Carte introuvable')
    const html2canvas = (await import('html2canvas')).default
    const capture = html2canvas(handle.$el, {
      useCORS: true,
      backgroundColor: null,
      scale: Math.min(2, window.devicePixelRatio || 1.5),
    })
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Capture trop longue')), 15000)
    })
    return Promise.race([capture, timeout])
  }

  async function downloadImage(filename = 'ma-carte') {
    downloadError.value = ''
    downloading.value = 'image'
    try {
      const canvas = await captureCanvas()
      const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
      if (!blob) throw new Error('Export impossible')
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${slugifyFilename(filename)}.png`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      downloadError.value = "Le telechargement a echoue, reessaie."
    } finally {
      downloading.value = ''
    }
  }

  async function downloadPdf(filename = 'ma-carte') {
    downloadError.value = ''
    downloading.value = 'pdf'
    try {
      const canvas = await captureCanvas()
      const { jsPDF } = await import('jspdf')
      const imgData = canvas.toDataURL('image/jpeg', 0.95)
      const pdf = new jsPDF({
        unit: 'px',
        format: [canvas.width, canvas.height],
      })
      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height)
      pdf.save(`${slugifyFilename(filename)}.pdf`)
    } catch (e) {
      downloadError.value = "Le telechargement a echoue, reessaie."
    } finally {
      downloading.value = ''
    }
  }

  return { downloading, downloadError, downloadImage, downloadPdf }
}
