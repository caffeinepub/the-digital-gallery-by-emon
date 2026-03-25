// Web Audio API sound utilities - shared context with autoplay policy fix

let sharedCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  try {
    if (!sharedCtx) {
      sharedCtx = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
    }
    return sharedCtx;
  } catch {
    return null;
  }
}

async function ensureCtx(): Promise<AudioContext | null> {
  const ctx = getCtx();
  if (!ctx) return null;
  if (ctx.state === "suspended") {
    try {
      await ctx.resume();
    } catch {
      // ignore
    }
  }
  return ctx;
}

// Prime AudioContext on first user interaction so later plays are instant
if (typeof window !== "undefined") {
  const prime = () => {
    getCtx();
    window.removeEventListener("click", prime);
    window.removeEventListener("touchstart", prime);
    window.removeEventListener("keydown", prime);
  };
  window.addEventListener("click", prime);
  window.addEventListener("touchstart", prime);
  window.addEventListener("keydown", prime);
}

export async function playClick(): Promise<void> {
  try {
    const ctx = await ensureCtx();
    if (!ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.frequency.value = 800;
    o.type = "sine";
    g.gain.setValueAtTime(0.1, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    o.start(ctx.currentTime);
    o.stop(ctx.currentTime + 0.06);
  } catch {}
}

export async function playSuccess(): Promise<void> {
  try {
    const ctx = await ensureCtx();
    if (!ctx) return;
    [523, 659, 784].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.frequency.value = freq;
      o.type = "sine";
      const t = ctx.currentTime + i * 0.15;
      g.gain.setValueAtTime(0.18, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      o.start(t);
      o.stop(t + 0.3);
    });
  } catch {}
}

export async function playError(): Promise<void> {
  try {
    const ctx = await ensureCtx();
    if (!ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.frequency.value = 220;
    o.type = "square";
    g.gain.setValueAtTime(0.08, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    o.start(ctx.currentTime);
    o.stop(ctx.currentTime + 0.15);
  } catch {}
}
