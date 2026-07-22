export function* slowsort(state) {
    const arr = state.arr;
    const n = arr.length;

    yield* slow(state, arr, 0, n - 1, 0);

    state.depth = 0;
    for (let i = 0; i < n; i++) state.sorted.add(i);
}

function* slow(state, arr, lo, hi, depth) {
    state.depth = depth;

    if (lo >= hi) return;

    const mid = Math.floor((lo + hi) / 2);

    yield* slow(state, arr, lo, mid, depth + 1);
    yield* slow(state, arr, mid + 1, hi, depth + 1);

    state.depth = depth;

    state.active = new Set([mid, hi]);
    yield { type: "compare", indices: [mid, hi] };

    if (arr[mid] > arr[hi]) {
        [arr[mid], arr[hi]] = [arr[hi], arr[mid]];
        yield { type: "swap", indices: [mid, hi] };
    }

    yield* slow(state, arr, lo, hi - 1, depth + 1);
}
