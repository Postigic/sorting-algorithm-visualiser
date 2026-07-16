export function* thanosSort(state) {
    const arr = state.arr;

    while (
        !arr.every((value, i) => i === arr.length - 1 || value <= arr[i + 1])
    ) {
        const half = Math.floor(arr.length / 2);

        if (Math.random() < 0.5) {
            arr.splice(0, half);
        } else {
            arr.splice(half);
        }

        yield;
    }

    for (let i = 0; i < arr.length; i++) {
        state.sorted.add(i);
    }
}
