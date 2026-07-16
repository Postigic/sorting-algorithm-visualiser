export function* pancakeSort(state) {
    const arr = state.arr;
    const n = arr.length;

    for (let size = n; size > 1; size--) {
        let maxIdx = 0;
        for (let k = 1; k < size; k++) {
            if (arr[k] > arr[maxIdx]) maxIdx = k;
        }

        if (maxIdx !== size - 1) {
            state.active = new Set([maxIdx, size - 1]);
            yield { type: "compare", indices: [maxIdx, size - 1] };

            if (maxIdx !== 0) {
                state.active = new Set([0, maxIdx]);
                yield;

                yield* flip(state, arr, maxIdx);
            }

            yield* flip(state, arr, size - 1);
        }

        state.sorted.add(size - 1);
    }

    state.sorted.add(0);
}

function* flip(state, arr, end) {
    let lo = 0;
    let hi = end;
    while (lo < hi) {
        [arr[lo], arr[hi]] = [arr[hi], arr[lo]];

        state.active = new Set([lo, hi]);
        yield { type: "swap", indices: [lo, hi] };

        lo++;
        hi--;
    }
}
