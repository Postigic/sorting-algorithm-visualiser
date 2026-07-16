export function* tournamentSort(state) {
    const arr = state.arr;
    const n = arr.length;

    let size = 1;
    while (size < n) size <<= 1;

    const leaves = [...arr, ...Array(size - n).fill(Infinity)];
    const tree = new Array(2 * size).fill(0);

    for (let i = 0; i < size; i++) tree[size + i] = i;

    const leavesDisplay = arr.map((v) => v);
    const leavesGroup = {
        label: null,
        values: leavesDisplay,
        active: new Set(),
        done: new Set(),
    };
    state.aux = { kind: "groups", groups: [leavesGroup] };

    for (let i = size - 1; i >= 1; i--) {
        const l = tree[2 * i];
        const r = tree[2 * i + 1];

        const visible = [...new Set([tree[2 * i], tree[2 * i + 1]])].filter(
            (x) => x < n,
        );
        state.active = new Set(visible);
        leavesGroup.active = new Set(visible);
        yield { type: "compare", indices: visible };

        tree[i] = leaves[l] <= leaves[r] ? l : r;
    }

    state.active = new Set();
    leavesGroup.active = new Set();
    yield;

    for (let pos = 0; pos < n; pos++) {
        const winner = tree[1];
        arr[pos] = leaves[winner];

        state.sorted.add(pos);
        state.active = new Set([pos]);
        leavesGroup.active = new Set([winner]);
        yield { type: "write", indices: [pos] };

        leaves[winner] = Infinity;
        leavesDisplay[winner] = null;
        leavesGroup.done.add(winner);
        leavesGroup.active = new Set();

        let i = Math.floor((size + winner) / 2);
        while (i >= 1) {
            const l = tree[2 * i];
            const r = tree[2 * i + 1];

            const visible = [...new Set([tree[2 * i], tree[2 * i + 1]])].filter(
                (x) => x < n,
            );
            state.active = new Set(visible);
            leavesGroup.active = new Set(visible);
            yield { type: "compare", indices: visible };

            tree[i] = leaves[l] <= leaves[r] ? l : r;
            i = Math.floor(i / 2);
        }

        state.active = new Set();
        leavesGroup.active = new Set();
        yield;
    }

    state.aux = null;
}
