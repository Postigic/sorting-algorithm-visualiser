export class State {
    constructor() {
        this.arr = [];
        this.active = new Set();
        this.sorted = new Set();
        this.pivot = new Set();
        this.depth = 0;
        this.n = 64;
    }

    resetMarkers() {
        this.active.clear();
        this.sorted.clear();
        this.pivot.clear();
        this.depth = 0;
    }
}
