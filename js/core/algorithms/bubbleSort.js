export function* bubbleSort(state) {
    const arr = state.arr;
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            state.active = new Set([j, j + 1]);
            yield { type: "compare", indices: [j, j + 1] };

            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                yield { type: "swap", indices: [j, j + 1] };
            }
        }

        state.sorted.add(n - i - 1);
    }

    state.sorted.add(0);
}

export function* earlyExitBubbleSort(state) {
    const arr = state.arr;
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        let swapped = false;

        for (let j = 0; j < n - i - 1; j++) {
            state.active = new Set([j, j + 1]);
            yield { type: "compare", indices: [j, j + 1] };

            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                yield { type: "swap", indices: [j, j + 1] };
                swapped = true;
            }
        }

        state.sorted.add(n - i - 1);

        if (!swapped) {
            for (let k = 0; k < n; k++) {
                state.sorted.add(k);
            }
            break;
        }
    }

    state.sorted.add(0);
}

export function* lastSwapBubbleSort(state) {
    const arr = state.arr;
    const n = arr.length;

    let right = n - 1;

    while (right > 0) {
        let lastSwap = 0;
        let swapped = false;

        for (let j = 0; j < right; j++) {
            state.active = new Set([j, j + 1]);
            yield { type: "compare", indices: [j, j + 1] };

            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                yield { type: "swap", indices: [j, j + 1] };

                swapped = true;
                lastSwap = j;
            }
        }

        for (let k = lastSwap + 1; k <= right; k++) {
            state.sorted.add(k);
        }

        right = lastSwap;

        if (!swapped) {
            for (let k = 0; k < n; k++) {
                state.sorted.add(k);
            }
            break;
        }
    }
}
