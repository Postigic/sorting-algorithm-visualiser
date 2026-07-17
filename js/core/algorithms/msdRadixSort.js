export function* msdRadixSort(state) {
    const arr = state.arr;
    const n = arr.length;

    const maxNum = Math.max(...arr);
    const maxDigits = String(maxNum).length;

    yield* msdSort(state, arr, 0, n - 1, maxDigits - 1, 0);

    state.depth = 0;
    for (let i = 0; i < n; i++) state.sorted.add(i);
}

function* msdSort(state, arr, lo, hi, digit, depth) {
    state.depth = depth;

    if (lo >= hi || digit < 0) return;

    const buckets = Array.from({ length: 10 }, () => []);
    const groups = buckets.map((values, d) => ({
        label: String(d),
        values,
        active: new Set(),
        done: new Set(),
    }));

    state.aux = { kind: "groups", groups };

    for (let i = lo; i <= hi; i++) {
        const d = Math.floor(arr[i] / 10 ** digit) % 10;

        state.active = new Set([i]);
        yield;

        buckets[d].push(arr[i]);

        groups[d].active = new Set([buckets[d].length - 1]);
        yield;
        groups[d].active = new Set();
    }

    let pos = lo;

    for (let d = 0; d < 10; d++) {
        for (let idx = 0; idx < buckets[d].length; idx++) {
            groups[d].active = new Set([idx]);
            state.active = new Set([pos]);
            yield;

            arr[pos] = buckets[d][idx];

            groups[d].active = new Set();
            groups[d].done.add(idx);
            yield { type: "write", indices: [pos] };

            pos++;
        }
    }

    state.aux = null;

    pos = lo;

    for (let d = 0; d < 10; d++) {
        const start = pos;
        const end = pos + buckets[d].length - 1;

        if (buckets[d].length > 1) {
            yield* msdSort(state, arr, start, end, digit - 1, depth + 1);
        }

        for (let i = start; i <= end; i++) {
            state.sorted.add(i);
        }

        pos += buckets[d].length;
    }
}
