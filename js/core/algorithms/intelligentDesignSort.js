export function* intelligentDesignSort(state) {
    const arr = state.arr;
    const n = arr.length;

    for (let i = 0; i < n; i++) {
        state.sorted.add(i);
    }

    yield;
}
