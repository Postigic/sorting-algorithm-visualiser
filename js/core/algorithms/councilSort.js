export function* councilSort(state) {
    const arr = state.arr;
    const n = arr.length;

    // just cause 10 is a nice number
    const chunkSize = 10;

    const council = [
        {
            name: "Traditionalist",
            fn: function* (start, end) {
                for (let i = start; i < end - 1; i++) {
                    state.active = new Set([i, i + 1]);
                    yield { type: "compare", indices: [i, i + 1] };

                    if (arr[i] > arr[i + 1]) return false;
                }
                return true;
            },
        },
        {
            name: "Contrarian",
            fn: function* (start, end) {
                for (let i = start; i < end - 1; i++) {
                    state.active = new Set([i, i + 1]);
                    yield { type: "compare", indices: [i, i + 1] };

                    if (arr[i] < arr[i + 1]) return false;
                }
                return true;
            },
        },
        {
            name: "Minimalist",
            fn: function* (start, end) {
                state.active = new Set([start, end - 1]);
                yield { type: "compare", indices: [start, end - 1] };

                if (arr[start] <= arr[end - 1]) return true;
                return false;
            },
        },
        {
            name: "Historian",
            fn: function* (start, end) {
                for (let i = end - 2; i >= start; i--) {
                    state.active = new Set([i, i + 1]);
                    yield { type: "compare", indices: [i, i + 1] };

                    if (arr[i] > arr[i + 1]) return false;
                }

                return true;
            },
        },
        {
            name: "Statistician",
            fn: function* (start, end) {
                const total = end - start - 1;

                let good = 0;

                for (let i = start; i < end - 1; i++) {
                    state.active = new Set([i, i + 1]);
                    yield { type: "compare", indices: [i, i + 1] };

                    if (arr[i] <= arr[i + 1]) {
                        good++;
                    }
                }

                return good > total / 2;
            },
        },
        {
            name: "Uninitiated",
            fn: function* () {
                for (let i = 0; i < 5; i++) {
                    // pretend to do work
                    const index = Math.floor(Math.random() * (arr.length - 1));

                    state.active = new Set([index, index + 1]);
                    yield { type: "compare", indices: [index, index + 1] };
                }

                // eh who knows
                if (Math.random() > 0.25) return true;
                return false;
            },
        },
        {
            name: "Optimist",
            fn: function* (start, end) {
                state.active = new Set([start, start + 1]);
                yield { type: "compare", indices: [start, start + 1] };

                if (arr[start] <= arr[start + 1]) return true;
                return false;
            },
        },
        {
            name: "Rejectionist",
            fn: function* () {
                return false;
            },
        },
        {
            name: "Interventionist",
            fn: function* (start, end) {
                for (let i = start; i < end - 1; i++) {
                    state.active = new Set([i, i + 1]);
                    yield { type: "compare", indices: [i, i + 1] };

                    if (arr[i] > arr[i + 1]) {
                        state.active = new Set([i, i + 1]);

                        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                        yield { type: "swap", indices: [i, i + 1] };

                        return true;
                    }
                }
                return false; // because they didn't get to intervene :(
            },
        },
        {
            name: "Narcoleptic",
            fn: function* () {
                for (let i = 0; i < 10; i++) {
                    yield;
                }
                return Math.random() > 0.5; // wakes up confused and gives a random answer
            },
        },
        {
            name: "Conformist",
            fn: function* () {
                let yay = 0;
                let nay = 0;

                for (let i = 0; i < state.aux.groups.length - 1; i++) {
                    const group = state.aux.groups[i];

                    group.active.add(0);
                    yield;

                    if (group.values[0] === "Yay") {
                        yay++;
                    } else if (group.values[0] === "Nay") {
                        nay++;
                    }

                    group.active.clear();
                }

                return yay >= nay;
            },
        },
    ];

    let boundary = 0;

    while (boundary < n) {
        const proposalEnd = Math.min(boundary + chunkSize, n);

        state.aux = {
            kind: "groups",
            groups: council.map(({ name }) => ({
                label: name,
                values: [null],
                active: new Set(),
                done: new Set(),
            })),
        };

        let yay = 0;
        let nay = 0;

        for (let i = 0; i < council.length; i++) {
            const { fn } = council[i];
            const group = state.aux.groups[i];

            group.active.add(0);

            const result = yield* fn(boundary, proposalEnd);

            state.active = new Set();
            group.values[0] = result ? "Yay" : "Nay";

            if (result) {
                yay++;
            } else {
                nay++;
            }

            yield;
            group.active.clear();
        }

        for (const group of state.aux.groups) {
            group.done.add(0);
        }

        if (yay > nay) {
            for (let i = boundary; i < proposalEnd; i++) state.sorted.add(i);

            boundary = proposalEnd;
        } else {
            for (let i = proposalEnd - 1; i > boundary; i--) {
                const j =
                    boundary + Math.floor(Math.random() * (i - boundary + 1));

                state.active = new Set([i, j]);
                yield;

                [arr[i], arr[j]] = [arr[j], arr[i]];

                yield { type: "swap", indices: [i, j] };
            }
        }

        state.active = new Set();
        yield;
    }

    state.aux = null;
}
