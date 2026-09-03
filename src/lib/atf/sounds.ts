let ctx: AudioContext | null = null;

function audio() {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) ctx = new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(c: AudioContext, freq: number, when: number, dur: number, gain = 0.05, type: OscillatorType = "sine") {
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, when);
  g.gain.exponentialRampToValueAtTime(gain, when + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(when);
  osc.stop(when + dur + 0.02);
}

export function playClaimSound(enabled: boolean) {
  if (!enabled) return;
  const c = audio();
  if (!c) return;
  const t = c.currentTime;
  tone(c, 880, t, 0.09, 0.045, "triangle");
  tone(c, 1174, t + 0.08, 0.12, 0.04, "sine");
}

export function playTaskSound(enabled: boolean) {
  if (!enabled) return;
  const c = audio();
  if (!c) return;
  const t = c.currentTime;
  tone(c, 784, t, 0.08, 0.04, "triangle");
  tone(c, 1046, t + 0.07, 0.11, 0.038, "sine");
}

export function playLevelUpSound(enabled: boolean) {
  if (!enabled) return;
  const c = audio();
  if (!c) return;
  const t = c.currentTime;
  tone(c, 523, t, 0.1, 0.04, "triangle");
  tone(c, 659, t + 0.1, 0.1, 0.045, "triangle");
  tone(c, 784, t + 0.2, 0.14, 0.05, "sine");
  tone(c, 1046, t + 0.32, 0.18, 0.04, "sine");
}

export function playTapSound(enabled: boolean) {
  if (!enabled) return;
  const c = audio();
  if (!c) return;
  tone(c, 1320, c.currentTime, 0.05, 0.03, "sine");
}
