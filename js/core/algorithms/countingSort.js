export function* countingSort(state) {
    const arr = state.arr;

    const maxNum = Math.max(...arr);
    const countArr = Array(maxNum + 1).fill(0);

    const histActive = new Set();
    const histDone = new Set();
    state.aux = {
        kind: "histogram",
        counts: countArr,
        active: histActive,
        done: histDone,
    };

    for (const [i, num] of arr.entries()) {
        countArr[num]++;

        histActive.clear();
        histActive.add(arr[i]);
        state.active = new Set([i]);
        yield;
    }

    state.active.clear();
    let pos = 0;

    for (const [val, count] of countArr.entries()) {
        histActive.clear();
        histActive.add(val);

        for (let i = 0; i < count; i++) {
            arr[pos] = val;
            state.sorted.add(pos);

            state.active = new Set([pos]);
            yield { type: "write", indices: [pos] };

            pos++;
        }

        histActive.delete(val);
        histDone.add(val);
    }

    state.aux = null;
}

export function* stableCountingSort(state) {
    const arr = state.arr;
    const n = arr.length;

    const maxNum = Math.max(...arr);
    const countArr = Array(maxNum + 1).fill(0);

    for (const [i, num] of arr.entries()) {
        countArr[num]++;
        state.active = new Set([i]);
        yield;
    }

    for (let i = 1; i < maxNum + 1; i++) {
        countArr[i] += countArr[i - 1];
    }

    state.active.clear();

    const output = new Array(n).fill(null);
    const outputGroup = {
        label: null,
        values: output,
        active: new Set(),
        done: new Set(),
    };
    state.aux = { kind: "groups", groups: [outputGroup] };

    for (let i = n - 1; i >= 0; i--) {
        const pos = countArr[arr[i]] - 1;
        const val = arr[i];

        outputGroup.active = new Set([pos]);
        yield;

        output[pos] = val;
        countArr[val]--;

        outputGroup.active = new Set();
        yield;
    }

    for (let i = 0; i < n; i++) {
        outputGroup.done.add(i);

        arr[i] = output[i];
        state.sorted.add(i);

        state.active = new Set([i]);
        yield { type: "write", indices: [i] };
    }

    state.aux = null;
}
