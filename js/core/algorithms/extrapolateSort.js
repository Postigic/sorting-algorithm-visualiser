export function* extrapolateSort(state) {
    const arr = state.arr;
    const n = arr.length;

    while (true) {
        const entries = [
            { label: "good", count: 0 },
            { label: "outliers", count: 0 },
        ];

        state.aux = {
            kind: "histogram",
            entries,
            active: new Set(),
            done: new Set(),
        };

        for (let i = 0; i < 20; i++) {
            const index = Math.floor(Math.random() * (arr.length - 1));
            const bucket = arr[index] <= arr[index + 1] ? 0 : 1;

            entries[bucket].count++;
            state.aux.active = new Set([bucket]);
            state.active = new Set([index, index + 1]);

            yield { type: "compare", indices: [index, index + 1] };
        }

        if (entries[0].count > entries[1].count) break;
    }

    state.aux = null;

    for (let i = 0; i < n; i++) state.sorted.add(i);
}
