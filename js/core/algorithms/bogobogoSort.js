export function* bogobogoSort(state) {
    const arr = state.arr;
    const n = arr.length;

    yield* bogobogoHelper(state, arr, n);

    for (let i = 0; i < n; i++) {
        state.sorted.add(i);
    }
}

function* bogobogoHelper(state, arr, n) {
    if (n <= 1) {
        return;
    }

    while (true) {
        for (let i = n - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            state.active = new Set([i, j]);
            yield;

            [arr[i], arr[j]] = [arr[j], arr[i]];

            yield { type: "swap", indices: [i, j] };
        }

        state.active.clear();
        yield;

        yield* bogobogoHelper(state, arr, n - 1);

        state.active.clear();
        yield;

        state.active = new Set([n - 2, n - 1]);
        yield { type: "compare", indices: [n - 2, n - 1] };

        if (arr[n - 2] <= arr[n - 1]) {
            break;
        }
    }
}
