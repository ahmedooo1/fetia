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

function isCanvasBlank(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return true
  const stepX = Math.max(1, Math.floor(canvas.width / 24))
  const stepY = Math.max(1, Math.floor(canvas.height / 24))
  for (let y = 0; y < canvas.height; y += stepY) {
    for (let x = 0; x < canvas.width; x += stepX) {
      if (ctx.getImageData(x, y, 1, 1).data[3] > 0) return false
    }
  }
  return true
}

export function useCardDownload(cardRef: Ref<CardHandle | null>) {
  const downloading = ref(false)
  const downloadError = ref('')

  async function ensureOpenAndSettled() {
    const handle = cardRef.value
    if (!handle) throw new Error('Carte introuvable')
    if (!handle.opened) {
      handle.open()
      await new Promise((r) => setTimeout(r, 950))
    }
    // attend que les polices custom (Cormorant, Great Vibes, etc.) soient
    // completement chargees et mesurees : sinon html2canvas peut calculer la
    // position verticale du texte avec les metriques de la police de repli,
    // ce qui decale le texte vers le bas dans l'image exportee
    if (typeof document !== 'undefined' && document.fonts) {
      await document.fonts.ready

      // Verifie que les polices personnalisees sont effectivement activees.
      // document.fonts.ready peut ressembler a `true` alors que certaines
      // fontes (avec font-display: swap) sont encore en fallback. On verifie
      // explicitement quelques familles principales et on attend jusqu'a 2s.
      const familiesToCheck = [
        'Cormorant Garamond',
        'Great Vibes',
        'Fraunces',
        'Playfair Display',
        'Baloo 2',
      ]

      const deadline = Date.now() + 2000
      async function fontsReady() {
        for (const fam of familiesToCheck) {
          try {
            // check retourne true si une fonte de cette famille est disponible
            if (document.fonts.check(`1rem "${fam}"`)) continue
            return false
          } catch {
            return false
          }
        }
        return true
      }

      while (!(await fontsReady()) && Date.now() < deadline) {
        // petite pause avant de retester
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 80))
      }
    } else {
      await new Promise((r) => setTimeout(r, 60))
    }
  }

  async function runCapture(target: HTMLElement, foreignObjectRendering: boolean) {
    const html2canvas = (await import('html2canvas')).default
    const capture = html2canvas(target, {
      useCORS: true,
      backgroundColor: null,
      scale: Math.min(2, window.devicePixelRatio || 1.5),
      foreignObjectRendering,
    })
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Capture trop longue')), 15000)
    })
    return Promise.race([capture, timeout])
  }

  async function captureCanvas() {
    await ensureOpenAndSettled()
    const handle = cardRef.value
    if (!handle) throw new Error('Carte introuvable')

    // masque temporairement les sections interactives (ex. formulaire RSVP) :
    // inutiles sur une image statique, et on evite ainsi l'espace vide qu'aurait
    // laisse data-html2canvas-ignore seul (qui n'exclut que le dessin, pas la mise en page)
    const hidden = handle.$el.querySelectorAll<HTMLElement>('[data-html2canvas-ignore]')
    const previousDisplay: string[] = []
    hidden.forEach((el, i) => {
      previousDisplay[i] = el.style.display
      el.style.display = 'none'
    })

    try {
      // le rendu foreignObject delegue le texte au moteur natif du navigateur
      // (corrige le decalage vertical du texte avec les polices custom), mais
      // c'est une fonctionnalite EXPERIMENTALE de html2canvas qui peut produire
      // une image totalement vide selon le contexte CSS (ex. parent "sticky").
      // On l'essaie en priorite, et on retombe sur le rendu standard si le
      // resultat est vide.
      const foreignObjectCanvas = await runCapture(handle.$el, true)
      if (!isCanvasBlank(foreignObjectCanvas)) return foreignObjectCanvas
      return await runCapture(handle.$el, false)
    } finally {
      hidden.forEach((el, i) => {
        el.style.display = previousDisplay[i]
      })
    }
  }

  async function downloadImage(filename = 'ma-carte') {
    downloadError.value = ''
    downloading.value = true
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
      downloading.value = false
    }
  }

  return { downloading, downloadError, downloadImage }
}
