export function* combSort(state) {
    const arr = state.arr;
    const n = arr.length;

    const shrink = 1.3;

    let gap = n;
    let isSorted = false;

    while (!isSorted) {
        gap = Math.floor(gap / shrink);

        if (gap <= 1) {
            gap = 1;
            isSorted = true;
        }

        for (let i = 0; i < n - gap; i++) {
            state.active = new Set([i, i + gap]);
            yield { type: "compare", indices: [i, i + gap] };

            if (arr[i] > arr[i + gap]) {
                [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]];
                yield { type: "swap", indices: [i, i + gap] };

                isSorted = false;
            }
        }
    }

    for (let i = 0; i < n; i++) {
        state.sorted.add(i);
    }
}

export function* combSort11(state) {
    const arr = state.arr;
    const n = arr.length;

    const shrink = 1.3;

    let gap = n;
    let isSorted = false;

    while (!isSorted) {
        gap = Math.floor(gap / shrink);

        if (gap <= 1) {
            gap = 1;
            isSorted = true;
        } else if (gap === 9 || gap === 10) {
            gap = 11;
        }

        for (let i = 0; i < n - gap; i++) {
            state.active = new Set([i, i + gap]);
            yield { type: "compare", indices: [i, i + gap] };

            if (arr[i] > arr[i + gap]) {
                [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]];
                yield { type: "swap", indices: [i, i + gap] };

                isSorted = false;
            }
        }
    }

    for (let i = 0; i < n; i++) {
        state.sorted.add(i);
    }
}
