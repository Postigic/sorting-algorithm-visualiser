export class State {
    constructor() {
        this.arr = [];
        this.active = new Set();
        this.sorted = new Set();
        this.pivot = new Set();
        this.depth = 0;
        this.n = 64;

        // when setting `aux`, only the following are defined:
        //   { kind: 'groups', groups: [{ label, values, active, done }, ...] }
        //     - a single unlabeled group covers a flat output buffer (stable
        //       counting sort, LSD radix); two groups cover merge sort's
        //       left/right runs; ten cover MSD radix's digit buckets.
        //       `active`/`done` are index Sets local to that group's `values`.
        //   { kind: 'histogram', counts: [...], active: Set, done: Set }
        //     - counts indexed by value, not position (unstable counting sort).
        //       `active`/`done` are value indices into `counts`, not positions.
        // hate my life
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
