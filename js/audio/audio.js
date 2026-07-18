const AUDIO_CTX = new (window.AudioContext || window.webkitAudioContext)();

const SUSTAIN = 0.12;
const VOLUME = 0.08;
const MAX_VOICES = 32;

const activeVoices = [];

function unlockAudioContext() {
    if (AUDIO_CTX.state === "suspended") {
        AUDIO_CTX.resume();
    }
}

function freq(val, n) {
    const lo = Math.log2(150);
    const hi = Math.log2(800);
    return Math.pow(2, lo + (hi - lo) * (val / n));
}

function envelope(length) {
    const attack = 0.025;
    const decay = 0.1;
    const sustain = 0.9;
    const release = 0.3;

    const env = new Float32Array(length);

    for (let i = 0; i < length; i++) {
        const x = length > 1 ? i / (length - 1) : 0;

        if (x < attack) {
            env[i] = x / attack;
        } else if (x < attack + decay) {
            env[i] = 1.0 - ((x - attack) / decay) * (1.0 - sustain);
        } else if (x < 1.0 - release) {
            env[i] = sustain;
        } else {
            env[i] = (sustain / release) * (1.0 - x);
        }
    }

    return env;
}

function loudnessComp(f) {
    const ref = 400;
    return Math.sqrt(ref / f);
}

function makeNoteBuffer(f, speed) {
    const duration = Math.max(0.03, SUSTAIN / speed);
    const sampleRate = AUDIO_CTX.sampleRate;
    const length = Math.floor(sampleRate * duration);

    const env = envelope(length);
    const comp = loudnessComp(f);

    const buffer = AUDIO_CTX.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        const phase = (f * t) % 1.0;
        const wave = phase < 0.5 ? 4 * phase - 1 : 3 - 4 * phase;

        data[i] = wave * env[i] * VOLUME * comp;
    }

    return buffer;
}

export function playTone(f, speed, muted) {
    if (muted) return;

    unlockAudioContext();

    if (activeVoices.length >= MAX_VOICES) {
        return;
    }

    const source = AUDIO_CTX.createBufferSource();
    source.buffer = makeNoteBuffer(f, speed);
    source.connect(AUDIO_CTX.destination);

    activeVoices.push(source);

    source.onended = () => {
        const idx = activeVoices.indexOf(source);
        if (idx !== -1) activeVoices.splice(idx, 1);
    };

    source.start();
}

export function playValue(val, maxVal, speed, muted) {
    playTone(freq(val, maxVal), speed, muted);
}

export { unlockAudioContext };
