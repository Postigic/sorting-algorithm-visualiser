export function* quantumBogoSort(state) {
    const arr = state.arr;
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        state.active = new Set([i, i + 1]);
        yield { type: "compare", indices: [i, i + 1] };

        if (arr[i] > arr[i + 1]) {
            location.replace("about:blank");
        }
    }

    state.active = new Set();
    yield;

    for (let i = 0; i < n; i++) state.sorted.add(i);
}
