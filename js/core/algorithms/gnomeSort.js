export function* gnomeSort(state) {
    const arr = state.arr;
    const n = arr.length;

    let i = 0;

    while (i < n) {
        if (i === 0) {
            state.active = new Set([i]);
            yield { type: "compare", indices: [i] };
            i++;
            continue;
        }

        state.active = new Set([i, i - 1]);
        yield { type: "compare", indices: [i, i - 1] };

        if (arr[i] >= arr[i - 1]) {
            i++;
        } else {
            [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
            yield { type: "swap", indices: [i, i - 1] };
            i--;
        }
    }

    for (let i = 0; i < n; i++) {
        state.sorted.add(i);
    }
}
