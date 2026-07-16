export function* introspectiveSort(state) {
    const arr = state.arr;
    const n = arr.length;
    const maxDepth = 2 * Math.floor(Math.log2(n));

    yield* introspectiveHelper(state, arr, 0, n - 1, maxDepth, 0);

    state.depth = 0;
}

function* introspectiveHelper(state, arr, lo, hi, maxDepth, depth) {
    state.depth = depth;
    const size = hi - lo + 1;

    if (size <= 16) {
        yield* insertionSort(state, arr, lo, hi);
    } else if (maxDepth === 0) {
        yield* heapSort(state, arr, lo, hi);
    } else {
        const mid = Math.floor((lo + hi) / 2);
        [arr[mid], arr[hi]] = [arr[hi], arr[mid]];

        state.pivot = new Set([hi]);
        state.active = new Set([mid]);
        yield { type: "swap", indices: [mid, hi] };

        const p = yield* partition(state, arr, lo, hi);
        state.pivot = new Set();

        yield* introspectiveHelper(
            state,
            arr,
            lo,
            p - 1,
            maxDepth - 1,
            depth + 1,
        );
        state.depth = depth;

        yield* introspectiveHelper(
            state,
            arr,
            p + 1,
            hi,
            maxDepth - 1,
            depth + 1,
        );
        state.depth = depth;
    }
}

function* insertionSort(state, arr, lo, hi) {
    for (let i = lo + 1; i <= hi; i++) {
        const key = arr[i];
        let j = i - 1;

        while (j >= lo) {
            state.active = new Set([j, j + 1]);
            yield { type: "compare", indices: [j, j + 1] };

            if (arr[j] <= key) break;

            arr[j + 1] = arr[j];
            yield { type: "write", indices: [j + 1] };

            j--;
        }

        arr[j + 1] = key;
        yield { type: "write", indices: [j + 1] };
    }

    for (let i = lo; i <= hi; i++) {
        state.sorted.add(i);
    }
}

function* heapSort(state, arr, lo, hi) {
    const n = hi - lo + 1;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        yield* heapify(state, arr, lo, n, lo + i);
    }

    for (let i = n - 1; i > 0; i--) {
        state.active = new Set([lo, lo + i]);
        [arr[lo], arr[lo + i]] = [arr[lo + i], arr[lo]];
        yield { type: "swap", indices: [lo, lo + i] };

        state.sorted.add(lo + i);
        yield* heapify(state, arr, lo, i, lo);
    }

    state.sorted.add(lo);
}

function* heapify(state, arr, base, n, i) {
    const localI = i - base;
    let largest = localI;
    const left = 2 * localI + 1;
    const right = 2 * localI + 2;

    if (left < n) {
        state.active = new Set([base + largest, base + left]);
        yield { type: "compare", indices: [base + largest, base + left] };

        if (arr[base + left] > arr[base + largest]) largest = left;
    }

    if (right < n) {
        state.active = new Set([base + largest, base + right]);
        yield { type: "compare", indices: [base + largest, base + right] };

        if (arr[base + right] > arr[base + largest]) largest = right;
    }

    if (largest !== localI) {
        [arr[i], arr[base + largest]] = [arr[base + largest], arr[i]];

        state.active = new Set([i, base + largest]);
        yield { type: "swap", indices: [i, base + largest] };

        yield* heapify(state, arr, base, n, base + largest);
    }
}

function* partition(state, arr, lo, hi) {
    const pivot = arr[hi];
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

    [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];

    state.active = new Set([i + 1, hi]);
    yield { type: "swap", indices: [i + 1, hi] };

    state.sorted.add(i + 1);
    return i + 1;
}
