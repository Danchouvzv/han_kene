// Web Audio API арқылы синтезделген дыбыстар — сыртқы файлсыз, интернетсіз жұмыс істейді.

let ctx = null
let master = null
let musicGain = null
let sfxGain = null
let musicTimer = null
let step = 0

function ensure() {
  if (ctx) return ctx
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = 0.9
  master.connect(ctx.destination)

  sfxGain = ctx.createGain()
  sfxGain.gain.value = 0.85
  sfxGain.connect(master)

  musicGain = ctx.createGain()
  musicGain.gain.value = 0.0
  musicGain.connect(master)
  return ctx
}

export function unlock() {
  const c = ensure()
  if (c && c.state === 'suspended') c.resume()
  return c
}

function tone({ freq, start = 0, dur = 0.18, type = 'sine', peak = 0.25, dest }) {
  const c = ensure()
  if (!c) return
  const t0 = c.currentTime + start
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(peak, t0 + 0.015)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g)
  g.connect(dest || sfxGain)
  osc.start(t0)
  osc.stop(t0 + dur + 0.05)
}

/** Дұрыс жауап — жарқын мажорлық арпеджио */
export function playCorrect() {
  unlock()
  const seq = [523.25, 659.25, 783.99, 1046.5]
  seq.forEach((f, i) => tone({ freq: f, start: i * 0.075, dur: 0.32, type: 'triangle', peak: 0.22 }))
  tone({ freq: 1567.98, start: 0.3, dur: 0.5, type: 'sine', peak: 0.09 })
}

/** Қате жауап — төмен түсетін ескерту дыбысы */
export function playWrong() {
  unlock()
  const c = ensure()
  if (!c) return
  const t0 = c.currentTime
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(240, t0)
  osc.frequency.exponentialRampToValueAtTime(110, t0 + 0.34)
  const filter = c.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(1200, t0)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(0.2, t0 + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.4)
  osc.connect(filter)
  filter.connect(g)
  g.connect(sfxGain)
  osc.start(t0)
  osc.stop(t0 + 0.45)
}

/** Жеңіл «шерту» дыбысы */
export function playClick() {
  unlock()
  tone({ freq: 880, dur: 0.07, type: 'sine', peak: 0.08 })
}

/** Тапсырма толық аяқталғанда — салтанатты фанфар */
export function playFinish() {
  unlock()
  const seq = [392, 523.25, 659.25, 783.99, 1046.5]
  seq.forEach((f, i) => tone({ freq: f, start: i * 0.11, dur: 0.6, type: 'triangle', peak: 0.2 }))
  tone({ freq: 261.63, start: 0, dur: 1.4, type: 'sine', peak: 0.12 })
}

/* ---------- Фондық музыка: пентатоникалық баяу арпеджио ---------- */

const SCALE = [220.0, 246.94, 293.66, 329.63, 392.0, 440.0, 493.88, 587.33]
const PATTERN = [0, 2, 4, 3, 5, 4, 2, 1, 0, 3, 5, 6, 4, 2, 1, 3]

function musicStep() {
  const c = ensure()
  if (!c) return
  const idx = PATTERN[step % PATTERN.length]
  const f = SCALE[idx]
  tone({ freq: f, dur: 1.9, type: 'sine', peak: 0.16, dest: musicGain })
  if (step % 4 === 0) {
    tone({ freq: f / 2, dur: 3.4, type: 'triangle', peak: 0.1, dest: musicGain })
  }
  if (step % 8 === 5) {
    tone({ freq: f * 1.5, start: 0.28, dur: 1.2, type: 'sine', peak: 0.06, dest: musicGain })
  }
  step += 1
}

export function startMusic() {
  const c = unlock()
  if (!c || musicTimer) return
  musicGain.gain.cancelScheduledValues(c.currentTime)
  musicGain.gain.setValueAtTime(0.0001, c.currentTime)
  musicGain.gain.exponentialRampToValueAtTime(0.5, c.currentTime + 2.2)
  musicStep()
  musicTimer = setInterval(musicStep, 900)
}

export function stopMusic() {
  const c = ensure()
  if (musicTimer) {
    clearInterval(musicTimer)
    musicTimer = null
  }
  if (c && musicGain) {
    musicGain.gain.cancelScheduledValues(c.currentTime)
    musicGain.gain.setValueAtTime(musicGain.gain.value || 0.0001, c.currentTime)
    musicGain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.9)
  }
}
