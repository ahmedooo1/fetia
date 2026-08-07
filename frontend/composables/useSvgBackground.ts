// html2canvas gere de facon peu fiable les <svg> inline dupliques et les
// data-URI SVG sans width/height explicites (elles retombent sur une taille
// intrinseque par defaut ~300x150, ce qui casse les traits fins une fois
// remis a l'echelle). Convertir en background-image CSS avec width/height
// explicites (calques sur le viewBox, agrandis pour rester nets) est le
// contournement fiable cote html2canvas.
export function svgBackgroundUrl(inner: string, viewBox: string, color: string) {
  const [, , vbWidth, vbHeight] = viewBox.split(/\s+/).map(Number)
  // agrandit pour une rasterisation nette, tout en gardant le ratio du viewBox
  const scale = Math.max(1, Math.min(8, Math.round(400 / Math.max(vbWidth, vbHeight))))
  const width = vbWidth * scale
  const height = vbHeight * scale
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}" fill="none">${inner.replace(/currentColor/g, color)}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}
