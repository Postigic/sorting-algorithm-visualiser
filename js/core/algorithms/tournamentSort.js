// no i don't understand anything here leave me alone

export function* tournamentSort(state) {
    const arr = state.arr;
    const n = arr.length;

    let size = 1;
    while (size < n) size <<= 1;

    const leaves = [...arr, ...Array(size - n).fill(Infinity)];
    const tree = new Array(2 * size).fill(0);

    for (let i = 0; i < size; i++) tree[size + i] = i;

    const active = new Set();
    const done = new Set();

    state.aux = { kind: "tree", tree, leaves, size, n, active, done };

    for (let i = size - 1; i >= 1; i--) {
        const l = tree[2 * i];
        const r = tree[2 * i + 1];

        active.clear();
        active.add(2 * i);
        active.add(2 * i + 1);
        active.add(i);

        const visibleLeaves = [...new Set([l, r])].filter((x) => x < n);
        state.active = new Set(visibleLeaves);
        yield { type: "compare", indices: visibleLeaves };

        tree[i] = leaves[l] <= leaves[r] ? l : r;
    }

    state.active = new Set();
    active.clear();
    yield;

    for (let pos = 0; pos < n; pos++) {
        const winner = tree[1];
        arr[pos] = leaves[winner];

        state.sorted.add(pos);
        state.active = new Set([pos]);
        active.clear();
        active.add(size + winner);
        yield { type: "write", indices: [pos] };

        leaves[winner] = Infinity;
        done.add(winner);

        let i = Math.floor((size + winner) / 2);
        while (i >= 1) {
            const l = tree[2 * i];
            const r = tree[2 * i + 1];

            active.clear();
            active.add(2 * i);
            active.add(2 * i + 1);
            active.add(i);

            const visibleLeaves = [...new Set([l, r])].filter((x) => x < n);
            state.active = new Set(visibleLeaves);
            yield { type: "compare", indices: visibleLeaves };

            tree[i] = leaves[l] <= leaves[r] ? l : r;

            i = Math.floor(i / 2);
        }

        state.active = new Set();
        active.clear();
        yield;
    }

    state.aux = null;
}
