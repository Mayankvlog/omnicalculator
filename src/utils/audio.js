let audioCtx = null;
let soundEnabled = true;

export function toggleSound(enabled) {
  soundEnabled = enabled;
}

export function isSoundEnabled() {
  return soundEnabled;
}

/**
 * Play a synthesized sound to emulate mechanical calculator keys or timers
 * @param {string} type 'click' | 'tick' | 'success' | 'beep' | 'error'
 */
export function playSound(type) {
  if (!soundEnabled) return;

  try {
    // Lazy initialize standard AudioContext
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }

    // Resume if suspended (browser security blocks audio before first user interaction)
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const time = audioCtx.currentTime;

    switch (type) {
      case 'click':
        // Quick high-pass click emulation (standard keypress tap)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, time);
        osc.frequency.exponentialRampToValueAtTime(120, time + 0.05);
        gainNode.gain.setValueAtTime(0.15, time);
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.04);
        osc.start(time);
        osc.stop(time + 0.05);
        break;

      case 'tick':
        // Soft stopwatch/timer tick
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, time);
        gainNode.gain.setValueAtTime(0.06, time);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.02);
        osc.start(time);
        osc.stop(time + 0.02);
        break;

      case 'beep':
        // High alarm chime for timers
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, time); // B5 note
        gainNode.gain.setValueAtTime(0.25, time);
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.25);
        osc.start(time);
        osc.stop(time + 0.3);
        break;

      case 'success':
        // Uplifting success indicator chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, time); // C5
        osc.frequency.setValueAtTime(659.25, time + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, time + 0.16); // G5
        gainNode.gain.setValueAtTime(0.15, time);
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.35);
        osc.start(time);
        osc.stop(time + 0.35);
        break;

      case 'error':
        // low Buzz for math error
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, time);
        osc.frequency.setValueAtTime(100, time + 0.08);
        gainNode.gain.setValueAtTime(0.18, time);
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.25);
        osc.start(time);
        osc.stop(time + 0.25);
        break;
    }
  } catch (err) {
    console.warn('Audio feedback failed to play:', err);
  }
}
