export function* insertionSort(state) {
    const arr = state.arr;
    const n = arr.length;

    for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;

        const auxGroup = {
            name: null,
            values: [key],
            active: new Set(),
            done: new Set(),
        };
        state.aux = { kind: "groups", groups: [auxGroup] };

        state.active = new Set([i]);
        yield;

        while (j >= 0) {
            state.active = new Set([j]);
            auxGroup.active = new Set([0]);
            yield { type: "compare", indices: [j] };

            if (arr[j] <= key) break;

            state.active = new Set([j + 1]);
            auxGroup.active = new Set();
            arr[j + 1] = arr[j];
            yield { type: "write", indices: [j + 1] };

            j--;
        }

        state.active = new Set([j + 1]);
        auxGroup.done = new Set([0]);
        arr[j + 1] = key;
        yield { type: "write", indices: [j + 1] };
    }

    for (let i = 0; i < n; i++) {
        state.sorted.add(i);
    }

    state.aux = null;
}

export function* binaryInsertionSort(state) {
    const arr = state.arr;
    const n = arr.length;

    for (let i = 1; i < n; i++) {
        let key = arr[i];

        const auxGroup = {
            name: null,
            values: [key],
            active: new Set(),
            done: new Set(),
        };
        state.aux = { kind: "groups", groups: [auxGroup] };

        state.active = new Set([i]);
        yield;

        let lo = 0;
        let hi = i;

        while (lo < hi) {
            const mid = Math.floor((lo + hi) / 2);

            state.active = new Set([mid]);
            auxGroup.active = new Set([0]);
            yield { type: "compare", indices: [mid] };

            if (arr[mid] <= key) {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }

        state.active = new Set([lo]);
        auxGroup.active = new Set();
        yield;

        let j = i;

        while (j > lo) {
            state.active = new Set([j]);
            arr[j] = arr[j - 1];
            yield { type: "write", indices: [j] };

            j--;
        }

        state.active = new Set([lo]);
        auxGroup.done = new Set([0]);
        arr[lo] = key;
        yield { type: "write", indices: [lo] };
    }

    for (let i = 0; i < n; i++) {
        state.sorted.add(i);
    }

    state.aux = null;
}
