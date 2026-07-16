export function* shellSort(state) {
    const arr = state.arr;
    const n = arr.length;

    let gap = Math.floor(n / 2);

    while (gap > 0) {
        for (let i = gap; i < n; i++) {
            const key = arr[i];
            let j = i;

            while (j >= gap && arr[j - gap] > key) {
                state.active = new Set([j, j - gap]);
                yield { type: "compare", indices: [j, j - gap] };

                arr[j] = arr[j - gap];
                j -= gap;
            }

            arr[j] = key;

            state.active = new Set([i, j]);
            yield { type: "write", indices: [j] };
        }

        gap = Math.floor(gap / 2);
    }

    for (let i = 0; i < n; i++) state.sorted.add(i);
}
