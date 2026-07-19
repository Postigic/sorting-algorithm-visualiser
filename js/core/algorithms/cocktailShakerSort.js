export function* cocktailShakerSort(state) {
    const arr = state.arr;
    const n = arr.length;

    for (let i = 0; i < Math.floor(n / 2); i++) {
        for (let j = i; j < n - i - 1; j++) {
            state.active = new Set([j, j + 1]);
            yield { type: "compare", indices: [j, j + 1] };

            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                yield { type: "swap", indices: [j, j + 1] };
            }
        }

        state.sorted.add(n - i - 1);

        for (let j = n - i - 1; j > i; j--) {
            state.active = new Set([j, j - 1]);
            yield { type: "compare", indices: [j, j - 1] };

            if (arr[j] < arr[j - 1]) {
                [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
                yield { type: "swap", indices: [j, j - 1] };
            }
        }

        state.sorted.add(i);
    }

    if (n % 2 === 1) {
        state.sorted.add(Math.floor(n / 2));
    }
}

export function* earlyExitCocktailShakerSort(state) {
    const arr = state.arr;
    const n = arr.length;

    for (let i = 0; i < Math.floor(n / 2); i++) {
        let swapped = false;

        for (let j = i; j < n - i - 1; j++) {
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

        swapped = false;

        for (let j = n - i - 1; j > i; j--) {
            state.active = new Set([j, j - 1]);
            yield { type: "compare", indices: [j, j - 1] };

            if (arr[j] < arr[j - 1]) {
                [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
                yield { type: "swap", indices: [j, j - 1] };
                swapped = true;
            }
        }

        state.sorted.add(i);

        if (!swapped) {
            for (let k = 0; k < n; k++) {
                state.sorted.add(k);
            }
            break;
        }
    }

    if (n % 2 === 1) {
        state.sorted.add(Math.floor(n / 2));
    }
}

export function* lastSwapCocktailShakerSort(state) {
    const arr = state.arr;
    const n = arr.length;

    let left = 0;
    let right = n - 1;

    while (left < right) {
        let lastSwap = left;
        let swapped = false;

        for (let j = left; j < right; j++) {
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

        swapped = false;
        lastSwap = right;

        for (let j = right; j > left; j--) {
            state.active = new Set([j, j - 1]);
            yield { type: "compare", indices: [j, j - 1] };

            if (arr[j] < arr[j - 1]) {
                [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
                yield { type: "swap", indices: [j, j - 1] };

                swapped = true;
                lastSwap = j;
            }
        }

        for (let k = left; k < lastSwap; k++) {
            state.sorted.add(k);
        }

        left = lastSwap;

        if (!swapped) {
            for (let k = 0; k < n; k++) {
                state.sorted.add(k);
            }
            break;
        }
    }
}
