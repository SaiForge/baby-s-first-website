// Web Audio API Sound Synthesizer for CutoBot Portfolio
// Inspired by AstroDither retro audio vibes and tactile hardware clicks

class SoundManager {
  private ctx: AudioContext | null = null;
  public muted: boolean = false;
  public volume: number = 0.3;
  private listeners: Set<(muted: boolean) => void> = new Set();

  constructor() {
    // Check saved mute preference
    if (typeof window !== 'undefined') {
      const savedMute = localStorage.getItem('cutobot_muted');
      if (savedMute !== null) {
        this.muted = savedMute === 'true';
      }
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public subscribe(fn: (muted: boolean) => void) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('cutobot_muted', String(muted));
    }
    this.listeners.forEach((fn) => fn(muted));
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted);
    if (!this.muted) {
      this.playClick();
    }
    return this.muted;
  }

  // Tactile mechanical switch click (inspired by sweet-tape & astrodither)
  public playClick(freq = 800) {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(120, t + 0.035);

      gain.gain.setValueAtTime(0.08 * this.volume * 3, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.035);
    } catch {
      // Audio fallback
    }
  }

  // Floppy antenna spring boing
  public playBoing() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, t);
      osc.frequency.exponentialRampToValueAtTime(620, t + 0.08);
      osc.frequency.exponentialRampToValueAtTime(240, t + 0.22);
      osc.frequency.exponentialRampToValueAtTime(480, t + 0.35);

      gain.gain.setValueAtTime(0.12 * this.volume * 3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.38);
    } catch {
      // Audio fallback
    }
  }

  // 8-bit Music Box Chime Note
  public playChime(noteFreq: number, duration = 0.5) {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // Primary tone
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(noteFreq, t);

      // Bell overtone harmonic
      const harm = this.ctx.createOscillator();
      const harmGain = this.ctx.createGain();
      harm.type = 'triangle';
      harm.frequency.setValueAtTime(noteFreq * 2.76, t);

      gain.gain.setValueAtTime(0.15 * this.volume * 3, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      harmGain.gain.setValueAtTime(0.05 * this.volume * 3, t);
      harmGain.gain.exponentialRampToValueAtTime(0.0001, t + duration * 0.4);

      osc.connect(gain);
      harm.connect(harmGain);
      gain.connect(this.ctx.destination);
      harmGain.connect(this.ctx.destination);

      osc.start(t);
      harm.start(t);
      osc.stop(t + duration);
      harm.stop(t + duration);
    } catch {
      // Audio fallback
    }
  }

  // Solar charging electrical hum & zap
  public playZap(chargeLevel = 1) {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      const baseFreq = 300 + chargeLevel * 80;
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.2, t + 0.12);

      gain.gain.setValueAtTime(0.09 * this.volume * 3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.14);
    } catch {
      // Audio fallback
    }
  }

  // Holo-Rattle bead collision sound
  public playRattle(pitch = 500) {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, t);
      osc.frequency.exponentialRampToValueAtTime(pitch * 1.5, t + 0.04);

      gain.gain.setValueAtTime(0.07 * this.volume * 3, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.06);
    } catch {
      // Audio fallback
    }
  }

  // Baby robot cheerful squeak / chirp
  public playSqueak() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, t); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, t + 0.08); // A5
      gain1.gain.setValueAtTime(0.12 * this.volume * 3, t);
      gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(t);
      osc1.stop(t + 0.12);

      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, t + 0.12);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, t + 0.22); // D6
      gain2.gain.setValueAtTime(0.12 * this.volume * 3, t + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(t + 0.12);
      osc2.stop(t + 0.25);
    } catch {
      // Audio fallback
    }
  }

  // Celebratory fanfare arpeggio
  public playFanfare() {
    if (this.muted) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playChime(freq, 0.4);
      }, idx * 90);
    });
  }
}

export const sounds = new SoundManager();
