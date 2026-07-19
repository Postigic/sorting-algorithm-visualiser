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

export function* optimisedCocktailShakerSort(state) {
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
