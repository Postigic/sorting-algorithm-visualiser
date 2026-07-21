export function* piecewiseSort(state) {
    const arr = state.arr;
    const n = arr.length;

    const subsetSize = 5;

    let left = 0;

    while (left < n) {
        const right = Math.min(left + subsetSize, n);

        for (let i = left; i < right - 1; i++) {
            for (let j = left; j < right - 1 - (i - left); j++) {
                state.active = new Set([j, j + 1]);
                yield { type: "compare", indices: [j, j + 1] };

                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    yield { type: "swap", indices: [j, j + 1] };
                }
            }

            state.sorted.add(right - 1 - (i - left));
        }

        state.sorted.add(left);
        left = right;
    }
}
