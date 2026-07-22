export function* stoogeSort(state) {
    const arr = state.arr;
    const n = arr.length;

    yield* stooge(state, arr, 0, n - 1, 0);

    state.depth = 0;
    for (let i = 0; i < n; i++) state.sorted.add(i);
}

function* stooge(state, arr, lo, hi, depth) {
    state.depth = depth;

    state.active = new Set([lo, hi]);
    yield { type: "compare", indices: [lo, hi] };

    if (arr[lo] > arr[hi]) {
        [arr[lo], arr[hi]] = [arr[hi], arr[lo]];
        yield { type: "swap", indices: [lo, hi] };
    }

    if (hi - lo + 1 > 2) {
        const third = Math.floor((hi - lo + 1) / 3);

        yield* stooge(state, arr, lo, hi - third, depth + 1);
        yield* stooge(state, arr, lo + third, hi, depth + 1);
        yield* stooge(state, arr, lo, hi - third, depth + 1);
    }
}
