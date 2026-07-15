export function* bogoSort(state) {
    const arr = state.arr;
    const n = arr.length;

    while (true) {
        let isSorted = true;

        for (let i = 0; i < n - 1; i++) {
            state.active = new Set([i, i + 1]);
            yield { type: "compare", indices: [i, i + 1] };

            if (arr[i] > arr[i + 1]) {
                isSorted = false;
                break;
            }
        }

        if (isSorted) {
            break;
        }

        state.active.clear();

        for (let i = n - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            state.active = new Set([i, j]);
            yield;

            [arr[i], arr[j]] = [arr[j], arr[i]];

            yield { type: "swap", indices: [i, j] };
        }

        yield;
    }

    for (let i = 0; i < n; i++) {
        state.sorted.add(i);
    }
}
