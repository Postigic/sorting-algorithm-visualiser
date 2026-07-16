// ported from the original .py code and i'm still kind of lost

export function* timsort(state) {
    const arr = state.arr;
    const n = arr.length;

    const minRun = computeMinRun(n);

    const runs = [];

    let i = 0;
    while (i < n) {
        let runLen = yield* countRun(state, arr, i, n);

        if (runLen < minRun) {
            const force = Math.min(minRun, n - i);
            yield* insertionRun(state, arr, i, i + force);
            runLen = force;
        }

        runs.push([i, runLen]);
        yield* mergeCollapse(state, arr, runs);

        i += runLen;
    }

    yield* mergeForceCollapse(state, arr, runs);

    for (let idx = 0; idx < n; idx++) state.sorted.add(idx);
}

function computeMinRun(n) {
    let r = 0;

    while (n >= 64) {
        r |= n & 1;
        n >>= 1;
    }

    return n + r;
}

function* countRun(state, arr, start, n) {
    if (start >= n) return 0;

    if (start >= n - 1) {
        state.active = new Set([start]);
        yield;

        return 1;
    }

    let i = start + 1;

    if (arr[i] < arr[start]) {
        state.active = new Set([start, i]);
        yield { type: "compare", indices: [start, i] };

        while (i < n && arr[i] < arr[i - 1]) {
            state.active = new Set([i - 1, i]);
            yield { type: "compare", indices: [i - 1, i] };

            i++;
        }

        yield* reverseRange(state, arr, start, i);
    } else {
        state.active = new Set([start, i]);
        yield { type: "compare", indices: [start, i] };

        while (i < n && arr[i] >= arr[i - 1]) {
            state.active = new Set([i - 1, i]);
            yield { type: "compare", indices: [i - 1, i] };

            i++;
        }
    }

    return i - start;
}

function* reverseRange(state, arr, start, end) {
    let lo = start;
    let hi = end - 1;

    while (lo < hi) {
        state.active = new Set([lo, hi]);
        [arr[lo], arr[hi]] = [arr[hi], arr[lo]];
        yield { type: "swap", indices: [lo, hi] };

        lo++;
        hi--;
    }
}

function* insertionRun(state, arr, lo, hi) {
    for (let i = lo + 1; i < hi; i++) {
        const key = arr[i];
        let j = i - 1;

        while (j >= lo && arr[j] > key) {
            state.active = new Set([j, j + 1]);
            yield { type: "compare", indices: [j, j + 1] };

            arr[j + 1] = arr[j];
            yield { type: "write", indices: [j + 1] };

            j--;
        }

        arr[j + 1] = key;
        yield { type: "write", indices: [j + 1] };
    }
}

function* mergeCollapse(state, arr, runs) {
    while (true) {
        const n = runs.length;
        if (n <= 1) return;

        if (n >= 3) {
            const A = runs[n - 3][1];
            const B = runs[n - 2][1];
            const C = runs[n - 1][1];

            if (A <= B + C) {
                if (A < C) {
                    yield* mergeAt(state, arr, runs, n - 3);
                } else {
                    yield* mergeAt(state, arr, runs, n - 2);
                }
                continue;
            }
        }

        if (n >= 2) {
            const B = runs[n - 2][1];
            const C = runs[n - 1][1];

            if (B <= C) {
                yield* mergeAt(state, arr, runs, n - 2);
                continue;
            }
        }

        break;
    }
}

function* mergeForceCollapse(state, arr, runs) {
    while (runs.length > 1) {
        yield* mergeAt(state, arr, runs, runs.length - 2);
    }
}

function* mergeAt(state, arr, runs, i) {
    const [start1, len1] = runs[i];
    const [start2, len2] = runs[i + 1];

    yield* merge(state, arr, start1, start1 + len1 - 1, start2 + len2 - 1);

    runs[i] = [start1, len1 + len2];
    runs.splice(i + 1, 1);
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
        yield { type: "compare", indices: [i, l.length + j] };

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
