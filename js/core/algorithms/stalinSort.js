export function* stalinSort(state) {
    const arr = state.arr;
    let i = 1;

    while (i < arr.length) {
        state.active = new Set([i, i - 1]);
        yield { type: "compare", indices: [i, i - 1] };

        if (arr[i] < arr[i - 1]) {
            arr.splice(i, 1);
            state.active = new Set([i]);
            yield { type: "write", indices: [i] };
        } else {
            state.sorted.add(i - 1);
            i++;
        }
    }

    for (let i = 0; i < arr.length; i++) {
        state.sorted.add(i);
    }
}
