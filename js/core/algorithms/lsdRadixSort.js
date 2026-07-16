export function* lsdRadixSort(state) {
    const arr = state.arr;
    const maxNum = Math.max(...arr);
    let exp = 1;

    while (Math.floor(maxNum / exp) > 0) {
        const isLast = Math.floor(maxNum / (exp * 10)) === 0;
        yield* countingPass(state, arr, exp, isLast);
        exp *= 10;
    }
}

function* countingPass(state, arr, exp, isLast) {
    const n = arr.length;
    const output = new Array(n).fill(null);
    const count = new Array(10).fill(0);

    for (let i = 0; i < n; i++) {
        const digit = Math.floor(arr[i] / exp) % 10;
        count[digit]++;

        state.active = new Set([i]);
        yield;
    }

    state.active.clear();

    for (let i = 1; i < 10; i++) count[i] += count[i - 1];

    const outputGroup = {
        label: null,
        values: output,
        active: new Set(),
        done: new Set(),
    };
    state.aux = { kind: "groups", groups: [outputGroup] };

    for (let i = n - 1; i >= 0; i--) {
        const digit = Math.floor(arr[i] / exp) % 10;
        const pos = count[digit] - 1;
        const val = arr[i];

        outputGroup.active = new Set([pos]);
        yield;

        output[pos] = val;
        count[digit]--;

        yield;
        outputGroup.active = new Set();
    }

    for (let i = 0; i < n; i++) {
        outputGroup.done.add(i);

        arr[i] = output[i];
        state.active = new Set([i]);

        if (isLast) state.sorted.add(i);

        yield { type: "write", indices: [i] };
    }

    state.aux = null;
}
