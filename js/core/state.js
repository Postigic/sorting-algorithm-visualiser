export class State {
    constructor() {
        this.arr = [];
        this.active = new Set();
        this.activeType = null; // "compare" | "swap" | "write" | null
        this.selfSwap = false;
        this.sorted = new Set();
        this.pivot = new Set();
        this.depth = 0;
        this.n = 64;
        this.aux = null;
    }

    resetMarkers() {
        this.active.clear();
        this.sorted.clear();
        this.pivot.clear();
        this.depth = 0;
        this.aux = null;
    }
}
