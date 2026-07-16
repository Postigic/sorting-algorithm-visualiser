import { State } from "./state.js";
import { ALGO_MAP, DATASET_MAP } from "./constants.js";
import { playValue } from "../audio/audio.js";

function emptyStats() {
    return { compares: 0, swaps: 0, writes: 0 };
}

export class Engine {
    constructor() {
        this.state = new State();

        this.algoName = "Bubble Sort";
        this.dataset = "Random";
        this.speed = 1.0;
        this.muted = false;
        this.running = false;

        this.stats = emptyStats();

        this._generator = null;
        this._lastStepTime = 0;

        this.shuffle();
    }

    shuffle(dataset = null) {
        if (dataset !== null) this.dataset = dataset;

        this.state.arr = DATASET_MAP[this.dataset](this.state.n);
        this.state.resetMarkers();
        this._reset();
    }

    setSize(n) {
        this.state.n = n;
        this.shuffle();
    }

    setDataset(dataset) {
        this.shuffle(dataset);
    }

    setAlgo(name) {
        this.algoName = name;
        this.shuffle();
    }

    run() {
        if (this.running) {
            this._pause();
            return false;
        }
        this.running = true;
        this._lastStepTime = performance.now();
        return true;
    }

    step() {
        this._ensureGenerator();
        return this._advance();
    }

    stop() {
        this._stop();
    }

    tick(now) {
        if (!this.running) return false;

        const stepIntervalMs = 100 / this.speed;

        this._ensureGenerator();

        while (now - this._lastStepTime >= stepIntervalMs) {
            this._lastStepTime += stepIntervalMs;

            if (!this._advance()) {
                this.running = false;
                return false;
            }
        }

        return true;
    }

    _ensureGenerator() {
        if (this._generator === null) {
            this.state.resetMarkers();
            this.stats = emptyStats();
            const algoFn = ALGO_MAP[this.algoName];
            this._generator = algoFn(this.state);
        }
    }

    _playActive() {
        for (const i of this.state.active) {
            playValue(this.state.arr[i], this.state.n, this.speed, this.muted);
        }
    }

    _recordEvent(event) {
        if (!event) return;
        if (event.type === "compare") this.stats.compares++;
        else if (event.type === "swap") this.stats.swaps++;
        else if (event.type === "write") this.stats.writes++;
    }

    _advance() {
        const { value, done } = this._generator.next();

        if (done) {
            this._generator = null;
            this.state.active.clear();
            return false;
        }

        this._recordEvent(value);
        this._playActive();
        return true;
    }

    _stop() {
        this.running = false;
    }

    _pause() {
        this.running = false;
        this.state.active.clear();
    }

    _reset() {
        this.running = false;
        this.state.active.clear();
        this._generator = null;
        this.stats = emptyStats();
    }
}

export const engine = new Engine();
