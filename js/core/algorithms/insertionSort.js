export function* insertionSort(state) {
    const arr = state.arr;
    const n = arr.length;

    for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;

        while (j >= 0) {
            state.active = new Set([j, j + 1]);
            yield { type: "compare", indices: [j, j + 1] };

            if (arr[j] <= key) break;

            arr[j + 1] = arr[j];
            yield { type: "write", indices: [j + 1] };

            j--;
        }

        state.active = new Set([j + 1, i]);
        arr[j + 1] = key;
        yield { type: "write", indices: [j + 1, i] };
    }

    for (let i = 0; i < n; i++) {
        state.sorted.add(i);
    }
}

export function* binaryInsertionSort(state) {
    const arr = state.arr;
    const n = arr.length;

    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let lo = 0;
        let hi = i;

        while (lo < hi) {
            const mid = Math.floor((lo + hi) / 2);

            state.active = new Set([mid, i]);
            yield { type: "compare", indices: [mid, i] };

            if (arr[mid] < key) {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }

        let j = i;

        while (j > lo) {
            state.active = new Set([j, j - 1]);
            arr[j] = arr[j - 1];
            yield { type: "write", indices: [j] };

            j--;
        }

        state.active = new Set([lo, i]);
        arr[lo] = key;
        yield { type: "write", indices: [lo, i] };
    }

    for (let i = 0; i < n; i++) {
        state.sorted.add(i);
    }
}
