export function* quickSort(state) {
    const arr = state.arr;
    yield* qs(state, arr, 0, arr.length - 1, false, false);
}

export function* randomisedQuickSort(state) {
    const arr = state.arr;
    yield* qs(state, arr, 0, arr.length - 1, true, false);
}

export function* medianOfThreeQuickSort(state) {
    const arr = state.arr;
    yield* qs(state, arr, 0, arr.length - 1, false, true);
}

export function* threeWayQuickSort(state) {
    const arr = state.arr;
    yield* qs3way(state, arr, 0, arr.length - 1);
}

export function* dualPivotQuickSort(state) {
    const arr = state.arr;
    yield* qsDual(state, arr, 0, arr.length - 1);
}

function* qs(state, arr, lo, hi, randomised, median) {
    if (lo >= hi) {
        if (lo === hi) state.sorted.add(lo);
        return;
    }

    const pivotIdx = yield* partition(state, arr, lo, hi, randomised, median);

    state.sorted.add(pivotIdx);
    state.pivot = new Set();

    yield* qs(state, arr, lo, pivotIdx - 1, randomised, median);
    yield* qs(state, arr, pivotIdx + 1, hi, randomised, median);
}

function* partition(state, arr, lo, hi, randomised, median) {
    if (randomised) {
        const randIdx = lo + Math.floor(Math.random() * (hi - lo + 1));

        [arr[randIdx], arr[hi]] = [arr[hi], arr[randIdx]];

        state.active = new Set([randIdx, hi]);
        yield { type: "swap", indices: [randIdx, hi] };

        state.pivot = new Set([hi]);
        state.active = new Set();
        yield;
    } else if (median && hi - lo >= 2) {
        const mid = Math.floor((lo + hi) / 2);

        state.active = new Set([lo, mid, hi]);
        yield { type: "compare", indices: [lo, mid, hi] };

        if (arr[lo] > arr[mid]) {
            [arr[lo], arr[mid]] = [arr[mid], arr[lo]];
            yield { type: "swap", indices: [lo, mid] };
        }

        if (arr[lo] > arr[hi]) {
            [arr[lo], arr[hi]] = [arr[hi], arr[lo]];
            yield { type: "swap", indices: [lo, hi] };
        }

        if (arr[mid] > arr[hi]) {
            [arr[mid], arr[hi]] = [arr[hi], arr[mid]];
            yield { type: "swap", indices: [mid, hi] };
        }

        [arr[mid], arr[hi]] = [arr[hi], arr[mid]];
        yield { type: "swap", indices: [mid, hi] };

        state.pivot = new Set([hi]);
        state.active = new Set();
        yield;
    }

    const pivot = arr[hi];
    state.pivot = new Set([hi]);
    let i = lo - 1;

    for (let j = lo; j < hi; j++) {
        state.active = new Set([j, hi]);
        yield { type: "compare", indices: [j, hi] };

        if (arr[j] <= pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];

            state.active = new Set([i, j]);
            yield { type: "swap", indices: [i, j] };
        }
    }

    state.active = new Set([i + 1, hi]);
    yield;

    [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];

    state.pivot = new Set([i + 1]);
    state.active = new Set();
    yield { type: "swap", indices: [i + 1, hi] };

    return i + 1;
}

function* qs3way(state, arr, lo, hi) {
    if (lo >= hi) {
        if (lo === hi) state.sorted.add(lo);
        return;
    }

    const [lt, gt] = yield* partition3way(state, arr, lo, hi);

    for (let i = lt; i <= gt; i++) state.sorted.add(i);

    yield* qs3way(state, arr, lo, lt - 1);
    yield* qs3way(state, arr, gt + 1, hi);
}

function* partition3way(state, arr, lo, hi) {
    const pivot = arr[lo];

    let lt = lo;
    let gt = hi;
    let i = lo;

    while (i <= gt) {
        state.active = new Set([i, lt, gt]);
        yield { type: "compare", indices: [i, lt, gt] };

        if (arr[i] < pivot) {
            [arr[i], arr[lt]] = [arr[lt], arr[i]];

            state.active = new Set([i, lt]);
            yield { type: "swap", indices: [i, lt] };

            lt++;
            i++;
        } else if (arr[i] > pivot) {
            [arr[i], arr[gt]] = [arr[gt], arr[i]];

            state.active = new Set([i, gt]);
            yield { type: "swap", indices: [i, gt] };

            gt--;
        } else {
            i++;
        }
    }

    state.active = new Set();
    yield;

    return [lt, gt];
}

function* qsDual(state, arr, lo, hi) {
    if (lo >= hi) {
        if (lo === hi) state.sorted.add(lo);
        return;
    }

    const [lt, gt] = yield* partitionDual(state, arr, lo, hi);

    state.sorted.add(lt);
    state.sorted.add(gt);

    yield* qsDual(state, arr, lo, lt - 1);
    yield* qsDual(state, arr, lt + 1, gt - 1);
    yield* qsDual(state, arr, gt + 1, hi);
}

function* partitionDual(state, arr, lo, hi) {
    state.active = new Set([lo, hi]);
    yield { type: "compare", indices: [lo, hi] };

    if (arr[lo] > arr[hi]) {
        [arr[lo], arr[hi]] = [arr[hi], arr[lo]];
        yield { type: "swap", indices: [lo, hi] };
    }

    const p1 = arr[lo];
    const p2 = arr[hi];
    state.pivot = new Set([lo, hi]);

    let lt = lo + 1;
    let gt = hi - 1;
    let k = lo + 1;

    while (k <= gt) {
        state.active = new Set([k, lo, hi]);
        yield { type: "compare", indices: [k, lo, hi] };

        if (arr[k] < p1) {
            [arr[k], arr[lt]] = [arr[lt], arr[k]];

            state.active = new Set([k, lt]);
            yield { type: "swap", indices: [k, lt] };

            lt++;
            k++;
        } else if (arr[k] > p2) {
            [arr[k], arr[gt]] = [arr[gt], arr[k]];

            state.active = new Set([k, gt]);
            yield { type: "swap", indices: [k, gt] };

            gt--;
        } else {
            k++;
        }
    }

    lt--;
    gt++;

    [arr[lo], arr[lt]] = [arr[lt], arr[lo]];
    [arr[hi], arr[gt]] = [arr[gt], arr[hi]];

    state.pivot = new Set([lt, gt]);
    state.active = new Set([lt, gt]);
    yield { type: "swap", indices: [lt, gt] };

    state.active = new Set();
    state.pivot = new Set();

    return [lt, gt];
}
