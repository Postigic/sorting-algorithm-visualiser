export function* selectionSort(state) {
    const arr = state.arr;
    const n = arr.length;

    for (let i = 0; i < n; i++) {
        let minIndex = i;

        for (let j = i + 1; j < n; j++) {
            state.active = new Set([minIndex, j]);
            yield { type: "compare", indices: [minIndex, j] };

            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }

        state.active = new Set([minIndex, i]);
        [arr[minIndex], arr[i]] = [arr[i], arr[minIndex]];
        yield { type: "swap", indices: [minIndex, i] };

        state.sorted.add(i);
    }
}
