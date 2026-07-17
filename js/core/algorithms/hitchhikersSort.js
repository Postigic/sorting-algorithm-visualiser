export function* hitchhikersSort(state) {
    const arr = state.arr;
    const n = arr.length;

    for (let i = 0; i < n; i++) {
        state.active = new Set([i]);
        arr[i] = 42;
        yield { type: "write", indices: [i] };

        state.sorted.add(i);
    }
}
