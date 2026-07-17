export function* fairShareSort(state) {
    const arr = state.arr;
    const n = arr.length;
    const share = arr.reduce((sum, value) => sum + value, 0) / n;

    for (let i = 0; i < n; i++) {
        state.active = new Set([i]);
        arr[i] = share;
        yield { type: "write", indices: [i] };

        state.sorted.add(i);
    }
}
