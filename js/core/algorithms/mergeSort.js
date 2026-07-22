export function* mergeSort(state) {
    const arr = state.arr;
    const n = arr.length;

    yield* topDown(state, arr, 0, n - 1, 0);

    state.depth = 0;
    for (let i = 0; i < n; i++) state.sorted.add(i);
}

export function* bottomUpMergeSort(state) {
    const arr = state.arr;
    const n = arr.length;
    let size = 1;

    while (size < n) {
        for (let left = 0; left < n; left += size * 2) {
            const mid = Math.min(left + size, n) - 1;
            const right = Math.min(left + size * 2, n) - 1;

            if (mid < right) {
                yield* merge(state, arr, left, mid, right);
            }
        }
        size *= 2;
    }

    for (let i = 0; i < n; i++) state.sorted.add(i);
}

function* topDown(state, arr, left, right, depth) {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);

    yield* topDown(state, arr, left, mid, depth + 1);
    yield* topDown(state, arr, mid + 1, right, depth + 1);
    yield* merge(state, arr, left, mid, right);
}

function* merge(state, arr, left, mid, right) {
    const l = arr.slice(left, mid + 1);
    const r = arr.slice(mid + 1, right + 1);

    const leftGroup = {
        label: "left",
        values: l,
        active: new Set(),
        done: new Set(),
    };
    const rightGroup = {
        label: "right",
        values: r,
        active: new Set(),
        done: new Set(),
    };
    state.aux = { kind: "groups", groups: [leftGroup, rightGroup] };

    let i = 0;
    let j = 0;
    let k = left;

    while (i < l.length && j < r.length) {
        leftGroup.active = new Set([i]);
        rightGroup.active = new Set([j]);
        state.active = new Set([k]);
        yield;

        const usedLeft = l[i] <= r[j];
        if (usedLeft) {
            arr[k] = l[i];
            i++;
        } else {
            arr[k] = r[j];
            j++;
        }

        if (usedLeft) leftGroup.done.add(i - 1);
        else rightGroup.done.add(j - 1);

        leftGroup.active = new Set();
        rightGroup.active = new Set();
        yield { type: "write", indices: [k] };

        k++;
    }

    while (i < l.length) {
        arr[k] = l[i];
        state.active = new Set([k]);
        leftGroup.done.add(i);
        yield { type: "write", indices: [k] };

        i++;
        k++;
    }

    while (j < r.length) {
        arr[k] = r[j];
        state.active = new Set([k]);
        rightGroup.done.add(j);
        yield { type: "write", indices: [k] };

        j++;
        k++;
    }

    state.aux = null;
}
