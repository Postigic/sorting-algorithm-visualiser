export function* bozoSort(state) {
    const arr = state.arr;
    const n = arr.length;

    while (!(yield* isSorted(state))) {
        let i = Math.floor(Math.random() * n);
        let j = Math.floor(Math.random() * n);

        state.active = new Set([i, j]);
        yield;

        [arr[i], arr[j]] = [arr[j], arr[i]];

        yield { type: "swap", indices: [i, j] };
    }

    for (let i = 0; i < n; i++) {
        state.sorted.add(i);
    }
}

function* isSorted(state) {
    const arr = state.arr;

    for (let i = 0; i < arr.length - 1; i++) {
        state.active = new Set([i, i + 1]);
        yield { type: "compare", indices: [i, i + 1] };

        if (arr[i] > arr[i + 1]) {
            return false;
        }
    }

    return true;
}
