export function* heapSort(state) {
    const arr = state.arr;
    const n = arr.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        yield* heapify(state, arr, n, i, 0);
    }

    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];

        state.active = new Set([0, i]);
        yield { type: "swap", indices: [0, i] };

        state.sorted.add(i);
        yield* heapify(state, arr, i, 0, 0);
    }

    state.depth = 0;
    state.sorted.add(0);
}

function* heapify(state, arr, n, i, depth) {
    state.depth = depth;

    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n) {
        state.active = new Set([i, left]);
        yield { type: "compare", indices: [i, left] };

        if (arr[left] > arr[largest]) largest = left;
    }

    if (right < n) {
        state.active = new Set([i, right]);
        yield { type: "compare", indices: [i, right] };

        if (arr[right] > arr[largest]) largest = right;
    }

    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];

        state.active = new Set([i, largest]);
        yield { type: "swap", indices: [i, largest] };

        yield* heapify(state, arr, n, largest, depth + 1);
    }
}
