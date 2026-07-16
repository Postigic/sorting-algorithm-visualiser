export function* cycleSort(state) {
    const arr = state.arr;
    const n = arr.length;

    for (let cycleStart = 0; cycleStart < n - 1; cycleStart++) {
        let item = arr[cycleStart];
        let pos = cycleStart;

        for (let i = cycleStart + 1; i < n; i++) {
            state.active = new Set([i, cycleStart]);
            yield { type: "compare", indices: [i, cycleStart] };

            if (arr[i] < item) pos++;
        }

        if (pos === cycleStart) {
            state.sorted.add(cycleStart);
            continue;
        }

        while (item === arr[pos]) pos++;

        [arr[pos], item] = [item, arr[pos]];
        state.active = new Set([pos, cycleStart]);
        yield { type: "write", indices: [pos] };

        while (pos !== cycleStart) {
            pos = cycleStart;

            for (let i = cycleStart + 1; i < n; i++) {
                state.active = new Set([i, cycleStart]);
                yield { type: "compare", indices: [i, cycleStart] };

                if (arr[i] < item) pos++;
            }

            while (item === arr[pos]) pos++;

            [arr[pos], item] = [item, arr[pos]];
            state.active = new Set([pos, cycleStart]);
            yield { type: "write", indices: [pos] };
        }

        state.sorted.add(cycleStart);
    }

    state.sorted.add(n - 1);
}
