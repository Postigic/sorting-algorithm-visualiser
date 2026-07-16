import { bogoSort } from "./algorithms/bogoSort.js";
import { bogobogoSort } from "./algorithms/bogobogoSort.js";
import { bozoSort } from "./algorithms/bozoSort.js";
import { bubbleSort, optimisedBubbleSort } from "./algorithms/bubbleSort.js";
import {
    cocktailSort,
    optimisedCocktailSort,
} from "./algorithms/cocktailSort.js";
import { combSort, combSort11 } from "./algorithms/combSort.js";
import { countingSort, stableCountingSort } from "./algorithms/countingSort.js";
import { cycleSort } from "./algorithms/cycleSort.js";
import { gnomeSort } from "./algorithms/gnomeSort.js";
import { heapSort } from "./algorithms/heapSort.js";
import {
    insertionSort,
    binaryInsertionSort,
} from "./algorithms/insertionSort.js";
import { intelligentDesignSort } from "./algorithms/intelligentDesignSort.js";
import { introspectiveSort } from "./algorithms/introspectiveSort.js";
import { lsdRadixSort } from "./algorithms/lsdRadixSort.js";
import { mergeSort, bottomUpMergeSort } from "./algorithms/mergeSort.js";
import { miracleSort } from "./algorithms/miracleSort.js";
import { msdRadixSort } from "./algorithms/msdRadixSort.js";
import { pancakeSort } from "./algorithms/pancakeSort.js";
import { quantumBogoSort } from "./algorithms/quantumBogoSort.js";
import {
    quickSort,
    randomisedQuickSort,
    medianOfThreeQuickSort,
    threeWayQuickSort,
    dualPivotQuickSort,
} from "./algorithms/quickSort.js";
import { selectionSort } from "./algorithms/selectionSort.js";
import { shellSort } from "./algorithms/shellSort.js";
import { slowSort } from "./algorithms/slowSort.js";
import { stalinSort } from "./algorithms/stalinSort.js";
import { stoogeSort } from "./algorithms/stoogeSort.js";
import { thanosSort } from "./algorithms/thanosSort.js";
import { timsort } from "./algorithms/timsort.js";
import { tournamentSort } from "./algorithms/tournamentSort.js";

function shuffleInPlace(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function sampleTwo(n) {
    const i = Math.floor(Math.random() * n);
    let j = Math.floor(Math.random() * n);
    while (j === i) j = Math.floor(Math.random() * n);
    return [i, j];
}

function randomArr(n) {
    const arr = Array.from({ length: n }, (_, i) => i + 1);
    return shuffleInPlace(arr);
}

function reversed(n) {
    return Array.from({ length: n }, (_, i) => n - i);
}

function sorted(n) {
    return Array.from({ length: n }, (_, i) => i + 1);
}

function nearlySorted(n) {
    const base = sorted(n);
    const swaps = Math.max(1, Math.floor(n / 10));
    for (let k = 0; k < swaps; k++) {
        const [i, j] = sampleTwo(n);
        [base[i], base[j]] = [base[j], base[i]];
    }
    return base;
}

function fewUnique(n) {
    const buckets = Math.max(2, Math.floor(n / 8));
    const values = shuffleInPlace(
        Array.from({ length: n }, (_, i) => i + 1),
    ).slice(0, buckets);
    return Array.from(
        { length: n },
        () => values[Math.floor(Math.random() * values.length)],
    );
}

function mountain(n) {
    const half = Math.floor(n / 2);
    const up = Array.from(
        { length: half },
        (_, i) => Math.floor((i / half) * n) + 1,
    );
    const down = [...up].reverse();
    return [...up, ...down].slice(0, n);
}

function singleSwap(n) {
    const base = sorted(n);
    const [i, j] = sampleTwo(n);
    [base[i], base[j]] = [base[j], base[i]];
    return base;
}

function sawtooth(n) {
    const teeth = Math.max(2, Math.floor(n / 8));
    return Array.from(
        { length: n },
        (_, i) => ((i % teeth) + 1) * Math.floor(n / teeth),
    );
}

function pipeOrgan(n) {
    const half = Math.floor(n / 2);
    const down = Array.from(
        { length: half },
        (_, i) => Math.floor(((half - i) / half) * n) + 1,
    );
    const up = Array.from(
        { length: half },
        (_, i) => Math.floor((i / half) * n) + 1,
    );
    return [...down, ...up].slice(0, n);
}

function alternating(n) {
    let lo = 1,
        hi = n;
    const arr = [];
    for (let i = 0; i < n; i++) {
        if (i % 2 === 0) {
            arr.push(hi);
            hi--;
        } else {
            arr.push(lo);
            lo++;
        }
    }
    return arr;
}

function sineWave(n) {
    return Array.from(
        { length: n },
        (_, i) =>
            Math.floor(((Math.sin((i / n) * 2 * Math.PI) + 1) / 2) * (n - 1)) +
            1,
    );
}

function shifted(n) {
    const split = Math.floor(n / 3);
    const base = sorted(n);
    return [...base.slice(split), ...base.slice(0, split)];
}

export const SIZES = ["4", "8", "16", "32", "64", "96", "128", "256", "512"];
export const MAX_SIZE = Number(SIZES[SIZES.length - 1]);

const DATASETS = [
    { name: "Random", fn: randomArr },
    { name: "Reversed", fn: reversed },
    { name: "Sorted", fn: sorted },
    { name: "Nearly Sorted", fn: nearlySorted },
    { name: "Few Unique", fn: fewUnique },
    { name: "Mountain", fn: mountain },
    { name: "Single Swap", fn: singleSwap },
    { name: "Sawtooth", fn: sawtooth },
    { name: "Pipe Organ", fn: pipeOrgan },
    { name: "Alternating", fn: alternating },
    { name: "Sine Wave", fn: sineWave },
    { name: "Shifted", fn: shifted },
].sort((a, b) => a.name.localeCompare(b.name));

export const DATASET_MAP = Object.fromEntries(
    DATASETS.map((d) => [d.name, d.fn]),
);
export const DATASET_NAMES = DATASETS.map((d) => d.name);

const ALGOS = [
    {
        name: "Bogo Sort",
        fn: bogoSort,
        time_worst: "Unbounded",
        time_avg: "O(n * n!)",
        time_best: "O(n)",
        aux: "O(1)",
        stable: false,
        inplace: true,
        metrics: { writes: false },
        desc: "Randomly shuffles the array until it happens to be sorted. Completely unusable in practice: even a 15-element array has 15! ~= 1.3 trillion possible orderings to stumble through. Exists purely as a joke and a reference point for how bad a sorting algorithm can theoretically be.",
    },
    {
        name: "Bubble Sort",
        fn: bubbleSort,
        time_worst: "O(n\u00b2)",
        time_avg: "O(n\u00b2)",
        time_best: "O(n\u00b2)",
        aux: "O(1)",
        stable: true,
        inplace: true,
        metrics: { writes: false },
        desc: "Repeatedly steps through the array comparing and swapping adjacent elements. One of the simplest sorting algorithms to understand and implement, but one of the least efficient; always O(n\u00b2) comparisons with no early exit. Outperformed by insertion sort in almost every scenario, even on small arrays. Used almost exclusively for teaching purposes.",
    },
    {
        name: "Optimised Bubble Sort",
        fn: optimisedBubbleSort,
        time_worst: "O(n\u00b2)",
        time_avg: "O(n\u00b2)",
        time_best: "O(n)",
        aux: "O(1)",
        stable: true,
        inplace: true,
        metrics: { writes: false },
        desc: "Bubble sort with an early exit when a full pass completes with no swaps, indicating the array is already sorted. Gives O(n) best case on already-sorted input and performs well on nearly sorted data. Still degrades to O(n\u00b2) on random or reverse-sorted arrays. The early exit is the minimum optimisation needed to make bubble sort not entirely useless.",
    },
    {
        name: "Insertion Sort",
        fn: insertionSort,
        time_worst: "O(n\u00b2)",
        time_avg: "O(n\u00b2)",
        time_best: "O(n)",
        aux: "O(1)",
        stable: true,
        inplace: true,
        metrics: { swaps: false },
        desc: "Builds a sorted region one element at a time by taking each new element and shifting it leftward into its correct position. Excellent on small arrays and nearly sorted data, where it approaches O(n) and outperforms more complex algorithms. Used as a subroutine in Timsort and Shell sort precisely for this reason. Degrades to O(n\u00b2) on large random or reverse-sorted input.",
    },
    {
        name: "Binary Insertion Sort",
        fn: binaryInsertionSort,
        time_worst: "O(n\u00b2)",
        time_avg: "O(n\u00b2)",
        time_best: "O(n log n)",
        aux: "O(1)",
        stable: true,
        inplace: true,
        metrics: { swaps: false },
        desc: "Insertion sort that uses binary search to find the correct position for each element rather than scanning linearly. Reduces comparisons from O(n\u00b2) to O(n log n), but element shifts remain O(n\u00b2) since each insertion still requires moving everything in between. A practical improvement when comparisons are expensive relative to moves: for example when comparing large structs by a key. Outperformed by Timsort on nearly sorted data but useful in constrained contexts.",
    },
    {
        name: "Selection Sort",
        fn: selectionSort,
        time_worst: "O(n\u00b2)",
        time_avg: "O(n\u00b2)",
        time_best: "O(n\u00b2)",
        aux: "O(1)",
        stable: false,
        inplace: true,
        metrics: { writes: false },
        desc: "Repeatedly scans the unsorted portion for the minimum element and swaps it into place. Always O(n\u00b2) with no best case improvement possible, making it strictly worse than insertion sort for most purposes. Its one genuine advantage is minimising writes; it performs at most n-1 swaps total, which can matter on flash storage or other write-sensitive memory.",
    },
    {
        name: "Merge Sort",
        fn: mergeSort,
        time_worst: "O(n log n)",
        time_avg: "O(n log n)",
        time_best: "O(n log n)",
        aux: "O(n)",
        stable: true,
        inplace: false,
        metrics: { swaps: false },
        desc: "Recursively splits the array in half, sorts each half, then merges them back together. Guarantees O(n log n) in all cases and is stable, making it the preferred choice when predictability and order preservation matter. Particularly well suited to linked lists and external sorting where random access is expensive. The main drawback is O(n) auxiliary space.",
    },
    {
        name: "Bottom-up Merge Sort",
        fn: bottomUpMergeSort,
        time_worst: "O(n log n)",
        time_avg: "O(n log n)",
        time_best: "O(n log n)",
        aux: "O(n)",
        stable: true,
        inplace: false,
        metrics: { swaps: false },
        desc: "An iterative merge sort that starts with runs of size 1 and repeatedly merges adjacent pairs, doubling the run size each pass until the array is sorted. Avoids recursion entirely, eliminating call stack overhead and making it straightforward to implement without worrying about stack depth. The merge phase of Timsort works on the same principle. Produces the same result as top-down merge sort with identical complexity but a visually distinct pattern; runs doubling in size left to right rather than a recursive halving.",
    },
    {
        name: "Miracle Sort",
        fn: miracleSort,
        time_worst: "Unbounded",
        time_avg: "Unbounded",
        time_best: "O(n)",
        aux: "O(1)",
        stable: null,
        inplace: true,
        metrics: { swaps: false, writes: false },
        desc: "Checks if the array is sorted and if not, simply waits. Relies on cosmic radiation flipping bits in memory until they happen to form a sorted array. Will never terminate on any real hardware. The joke is that it requires no code beyond the check; the sorting is outsourced to the universe.",
    },
    {
        name: "Stalin Sort",
        fn: stalinSort,
        time_worst: "O(n)",
        time_avg: "O(n)",
        time_best: "O(n)",
        aux: "O(1)",
        stable: true,
        inplace: true,
        metrics: { swaps: false },
        desc: "Removes any out-of-order element rather than moving it, leaving a sorted subsequence of the original. O(n) in a single pass. Not a real sorting algorithm since it destroys data, but technically produces a sorted result. The name and premise are a dark joke about eliminating problems rather than solving them.",
    },
    {
        name: "Thanos Sort",
        fn: thanosSort,
        time_worst: "O(n log n)",
        time_avg: "O(n log n)",
        time_best: "O(n)",
        aux: "O(1)",
        stable: null,
        inplace: true,
        metrics: { swaps: false },
        desc: "Repeatedly deletes a random half of the array until what remains happens to be sorted. Guaranteed to terminate as at most O(log n) halvings the array shrinks to a single element, which is trivially sorted. Each halving requires an O(n) sorted check, giving O(n log n) total. Like Stalin sort, it produces a sorted result by destroying data rather than rearranging it. A joke on Thanos\u2019s approach to overpopulation.",
    },
    {
        name: "Quick Sort",
        fn: quickSort,
        time_worst: "O(n\u00b2)",
        time_avg: "O(n log n)",
        time_best: "O(n log n)",
        aux: "O(log n)",
        stable: false,
        inplace: true,
        metrics: { writes: false },
        desc: "Selects a pivot, partitions the array into elements less than and greater than the pivot, then recurses on each side. Very fast in practice due to excellent cache locality and the most widely used sorting algorithm in standard libraries. This implementation uses the last element as the pivot, which hits O(n\u00b2) on already sorted input; a known weakness of naive pivot selection.",
    },
    {
        name: "Randomised Quick Sort",
        fn: randomisedQuickSort,
        time_worst: "O(n\u00b2)",
        time_avg: "O(n log n)",
        time_best: "O(n log n)",
        aux: "O(log n)",
        stable: false,
        inplace: true,
        metrics: { writes: false },
        desc: "Quick sort with a randomly chosen pivot rather than always using the last element. The randomisation makes the O(n\u00b2) worst case statistically negligible; no input pattern can reliably trigger it. Retains all the cache efficiency of standard quick sort while eliminating its predictable failure mode. A simple but significant improvement over the naive version.",
    },
    {
        name: "Median-of-Three Quick Sort",
        fn: medianOfThreeQuickSort,
        time_worst: "O(n\u00b2)",
        time_avg: "O(n log n)",
        time_best: "O(n log n)",
        aux: "O(log n)",
        stable: false,
        inplace: true,
        metrics: { writes: false },
        desc: "Quick sort that selects its pivot as the median of the first, middle, and last elements. Eliminates the worst case on already sorted or reverse-sorted input without any randomness, and tends to produce more balanced partitions than random pivot selection. The approach used by most real implementations including GCC\u2019s introsort. Slightly more cache-friendly than randomised quick sort since it reads three fixed positions rather than a random one.",
    },
    {
        name: "3-Way Quick Sort",
        fn: threeWayQuickSort,
        time_worst: "O(n\u00b2)",
        time_avg: "O(n log n)",
        time_best: "O(n)",
        aux: "O(log n)",
        stable: false,
        inplace: true,
        metrics: { writes: false },
        desc: "Quick sort that partitions into three regions: less than, equal to, and greater than the pivot using Dijkstra\u2019s Dutch National Flag algorithm. The equal region is settled in a single pass and never recursed on again, making it optimal on inputs with many duplicate keys where standard quick sort degrades toward O(n\u00b2). Best case O(n) occurs when all elements are equal.",
    },
    {
        name: "Dual-Pivot Quick Sort",
        fn: dualPivotQuickSort,
        time_worst: "O(n\u00b2)",
        time_avg: "O(n log n)",
        time_best: "O(n log n)",
        aux: "O(log n)",
        stable: false,
        inplace: true,
        metrics: { writes: false },
        desc: "Quick sort that selects two pivots and partitions into three regions: less than the first pivot, between the two pivots, and greater than the second pivot. Introduced by Yaroslavskiy and used in Java\u2019s Arrays.sort for primitive types since Java 7. Performs fewer comparisons than single-pivot quick sort in practice and has better cache behaviour than 3-way partitioning on inputs without many duplicates. The two-pivot approach means the middle partition, typically the largest, is handled in a single recursive call.",
    },
    {
        name: "Heap Sort",
        fn: heapSort,
        time_worst: "O(n log n)",
        time_avg: "O(n log n)",
        time_best: "O(n log n)",
        aux: "O(1)",
        stable: false,
        inplace: true,
        metrics: { writes: false },
        desc: "Builds a max-heap from the array, then repeatedly extracts the maximum into its final sorted position. Guarantees O(n log n) in all cases with O(1) auxiliary space; theoretically optimal on both counts. In practice it is slower than quick sort due to poor cache locality from jumping around the heap. Useful when guaranteed performance and minimal memory use are both required.",
    },
    {
        name: "Counting Sort",
        fn: countingSort,
        time_worst: "O(n + k)",
        time_avg: "O(n + k)",
        time_best: "O(n + k)",
        aux: "O(k)",
        stable: false,
        inplace: false,
        metrics: { compares: false, swaps: false },
        desc: "Counts occurrences of each value and reconstructs the sorted array by writing each value back the appropriate number of times. Only practical when the value range k is bounded and known in advance. Non-comparison based, so it sidesteps the O(n log n) lower bound entirely and runs in O(n + k). This implementation uses value reconstruction rather than the stable prefix-sum pattern, so it does not preserve the relative order of equal elements.",
    },
    {
        name: "Stable Counting Sort",
        fn: stableCountingSort,
        time_worst: "O(n + k)",
        time_avg: "O(n + k)",
        time_best: "O(n + k)",
        aux: "O(n + k)",
        stable: true,
        inplace: false,
        metrics: { compares: false, swaps: false },
        desc: "Counting sort using the prefix-sum pattern; counts are accumulated into cumulative totals, then elements are placed into an output array by iterating the input in reverse. The reverse iteration is what preserves relative order of equal elements, making it stable. This is the canonical implementation used as the inner sort in LSD radix sort, where stability across passes is required for correctness.",
    },
    {
        name: "LSD Radix Sort",
        fn: lsdRadixSort,
        time_worst: "O(d(n + k))",
        time_avg: "O(d(n + k))",
        time_best: "O(d(n + k))",
        aux: "O(n + k)",
        stable: true,
        inplace: false,
        metrics: { compares: false, swaps: false },
        desc: "Sorts integers digit by digit from least to most significant, using a stable sort at each pass. Non-comparison based and very fast for fixed-length integers or strings with a bounded digit count. Less cache-friendly than comparison sorts and requires O(n + k) auxiliary space per pass. Preferred over MSD for uniform-length keys.",
    },
    {
        name: "MSD Radix Sort",
        fn: msdRadixSort,
        time_worst: "O(d(n + k))",
        time_avg: "O(d(n + k))",
        time_best: "O(d(n + k))",
        aux: "O(n + k)",
        stable: true,
        inplace: false,
        metrics: { compares: false, swaps: false },
        desc: "Sorts digit by digit from most to least significant, recursing into each bucket. Single-element buckets are skipped. Can be faster than LSD for variable-length keys since it can short-circuit on buckets that are already uniform. More complex to implement correctly than LSD. Same asymptotic complexity but different practical characteristics.",
    },
    {
        name: "Cocktail Sort",
        fn: cocktailSort,
        time_worst: "O(n\u00b2)",
        time_avg: "O(n\u00b2)",
        time_best: "O(n\u00b2)",
        aux: "O(1)",
        stable: true,
        inplace: true,
        metrics: { writes: false },
        desc: "A bidirectional variant of bubble sort that alternates between forward and backward passes. The backward pass handles turtles; small elements near the end of the array that take many passes to bubble leftward in standard bubble sort. Slightly better in practice than bubble sort but same O(n\u00b2) worst case, and still outperformed by insertion sort.",
    },
    {
        name: "Optimised Cocktail Sort",
        fn: optimisedCocktailSort,
        time_worst: "O(n\u00b2)",
        time_avg: "O(n\u00b2)",
        time_best: "O(n)",
        aux: "O(1)",
        stable: true,
        inplace: true,
        metrics: { writes: false },
        desc: "Cocktail sort with the same early-exit optimisation as optimised bubble sort; terminates as soon as a full bidirectional pass produces no swaps. O(n) on sorted input. Handles nearly sorted data better than optimised bubble sort due to the bidirectional passes reducing turtle movement. Still O(n\u00b2) in the general case.",
    },
    {
        name: "Shell Sort",
        fn: shellSort,
        time_worst: "O(n\u00b2)",
        time_avg: "O(n log\u00b2 n)",
        time_best: "O(n log n)",
        aux: "O(1)",
        stable: false,
        inplace: true,
        metrics: { writes: false },
        desc: "Insertion sort generalised to compare elements at a shrinking gap distance, performing a final gap-1 pass to finish. The large initial gaps move elements close to their final positions quickly, making the last insertion sort pass cheap. This implementation uses simple halving for the gap sequence, giving O(n\u00b2) worst case; better sequences like Ciura\u2019s improve this significantly in practice. A good middle ground that is simple to implement and faster than pure insertion sort on larger inputs.",
    },
    {
        name: "Cycle Sort",
        fn: cycleSort,
        time_worst: "O(n\u00b2)",
        time_avg: "O(n\u00b2)",
        time_best: "O(n\u00b2)",
        aux: "O(1)",
        stable: false,
        inplace: true,
        metrics: { swaps: false },
        desc: "Based on the cycle structure of permutations; each element is moved directly to its final position in a cycle, then the next cycle begins. Minimises meaningful array writes to at most n-1, making it uniquely suited to memory where writes are expensive or have limited endurance such as flash storage. Despite minimising writes, it is slow in practice due to O(n\u00b2) comparisons. Rarely seen outside of specialised embedded or hardware contexts.",
    },
    {
        name: "Pancake Sort",
        fn: pancakeSort,
        time_worst: "O(n\u00b2)",
        time_avg: "O(n\u00b2)",
        time_best: "O(n)",
        aux: "O(1)",
        stable: false,
        inplace: true,
        metrics: { writes: false },
        desc: "Sorts using only prefix reversals, flipping the first k elements of the array. Each step finds the current maximum, flips it to the front, then flips it to its final position. A mathematical curiosity with roots in combinatorics and the burnt pancake problem. No practical sorting application; primarily studied for the minimum number of flips required to sort a sequence.",
    },
    {
        name: "Gnome Sort",
        fn: gnomeSort,
        time_worst: "O(n\u00b2)",
        time_avg: "O(n\u00b2)",
        time_best: "O(n)",
        aux: "O(1)",
        stable: true,
        inplace: true,
        metrics: { writes: false },
        desc: "Walks forward through the array and on finding an out-of-order element swaps it backward one position at a time until it is in the right place, then resumes walking forward. Functionally identical to insertion sort but arrives at the same result through a different mechanical process. Simpler to implement than insertion sort but slower in practice due to the single-step backward movement. Named after a Dutch garden gnome sorting flower pots by size.",
    },
    {
        name: "Timsort",
        fn: timsort,
        time_worst: "O(n log n)",
        time_avg: "O(n log n)",
        time_best: "O(n)",
        aux: "O(n)",
        stable: true,
        inplace: false,
        desc: "A hybrid of insertion sort and merge sort developed by Tim Peters, used as the built-in sort in Python and for objects in Java (Java uses dual-pivot quicksort for primitive arrays). Detects and exploits existing runs of sorted or reverse-sorted data in the input, sorting small runs with insertion sort and merging them with a merge sort variant. Achieves O(n) on already sorted or nearly sorted input and consistently outperforms pure merge sort on real-world data. The gold standard for general-purpose stable sorting of in-memory data.",
    },
    {
        name: "Stooge Sort",
        fn: stoogeSort,
        time_worst: "O(n^(log 3 / log 1.5))",
        time_avg: "O(n^(log 3 / log 1.5))",
        time_best: "O(n^(log 3 / log 1.5))",
        aux: "O(log n)",
        stable: false,
        inplace: true,
        metrics: { writes: false },
        desc: "Recursively sorts the first two-thirds of the array, then the last two-thirds, then the first two-thirds again. Named after the Three Stooges. The three overlapping recursive calls are provably inefficient at approximately O(n^2.71), making it slower than bubble sort and every other quadratic algorithm. Exists as a theoretical example of a correctly sorting algorithm that is nonetheless worse than naive approaches.",
    },
    {
        name: "Slow Sort",
        fn: slowSort,
        time_worst: "O(n^(log n / 2))",
        time_avg: "O(n^(log n / 2))",
        time_best: "O(n^(log n / 2))",
        aux: "O(log n)",
        stable: false,
        inplace: true,
        metrics: { writes: false },
        desc: "Based on the multiply-and-surrender paradigm, deliberately the opposite of divide and conquer. Recursively sorts both halves, promotes the maximum to the end, then recursively sorts everything except the last element, including re-sorting already partially sorted regions. The redundant overlap makes it superpolynomial. Designed specifically as a joke to be provably non-optimal while still being a correct sorting algorithm.",
    },
    {
        name: "Comb Sort",
        fn: combSort,
        time_worst: "O(n\u00b2)",
        time_avg: "O(n\u00b2 / 2^p)",
        time_best: "O(n log n)",
        aux: "O(1)",
        stable: false,
        inplace: true,
        metrics: { writes: false },
        desc: "Bubble sort generalised to compare elements at a gap distance, shrinking the gap by a factor of 1.3 each pass until it reaches 1 and finishes like a regular bubble sort. The large initial gaps eliminate turtles; small elements near the end that make bubble sort slow, early in the process. A practical improvement over bubble sort for the same reason shell sort improves on insertion sort.",
    },
    {
        name: "Comb Sort 11",
        fn: combSort11,
        time_worst: "O(n\u00b2)",
        time_avg: "O(n\u00b2 / 2^p)",
        time_best: "O(n log n)",
        aux: "O(1)",
        stable: false,
        inplace: true,
        metrics: { writes: false },
        desc: "Comb sort with an empirical adjustment that skips gap values of 9 and 10, jumping straight to 11. These gap sizes are known to leave turtles unresolved and perform poorly in practice. The skip improves average performance measurably. The name refers to 11 being the smallest gap size this variant will actually use.",
    },
    {
        name: "Intelligent Design Sort",
        fn: intelligentDesignSort,
        time_worst: "O(1)",
        time_avg: "O(1)",
        time_best: "O(1)",
        aux: "O(1)",
        stable: true,
        inplace: true,
        metrics: { compares: false, swaps: false, writes: false },
        desc: "Asserts that the array is already sorted, on the grounds that the probability of any particular arrangement arising by chance is 1/n! which for large n is so vanishingly small that it cannot have occurred randomly. The current order must therefore be the result of intentional design by an omniscient being who, by definition, chose optimally. Returns immediately. Any attempt to re-sort the output is theologically incoherent. The implementation is a no-op; the proof of correctness is left as an exercise in faith.",
    },
    {
        name: "Bogobogo Sort",
        fn: bogobogoSort,
        time_worst: "Unbounded",
        time_avg: "O((n!^n))",
        time_best: "O(n)",
        aux: "O(n)",
        stable: false,
        inplace: false,
        metrics: { writes: false },
        desc: "A recursive descent into madness built on bogosort. To sort k elements, it randomly shuffles them, recursively bogobogosorts the first k-1, then checks if all k are now in order, restarting the whole process if not. Each level depends on the level below completing first, multiplying an already incomprehensible runtime at every step. Even small arrays are effectively impossible to sort in any reasonable timeframe. Not a joke about bad sorting; a joke about what happens when you recurse a joke.",
    },
    {
        name: "Bozo Sort",
        fn: bozoSort,
        time_worst: "Unbounded",
        time_avg: "O(n * n!)",
        time_best: "O(n)",
        aux: "O(1)",
        stable: false,
        inplace: true,
        metrics: { writes: false },
        desc: "Picks two random positions and swaps them, then checks if the array is sorted. Repeats until it is. Often conflated with bogosort but mechanically distinct. Bogosort reshuffles the entire array each pass, bozo sort disturbs only two elements. In practice this makes it neither better nor worse in any meaningful sense; it still averages O(n * n!) and can technically run forever. The name is the joke: it is, in fact, a bozo\u2019s approach to sorting.",
    },
    {
        name: "Quantum Bogo Sort",
        fn: quantumBogoSort,
        time_worst: "O(n)",
        time_avg: "O(n)",
        time_best: "O(n)",
        aux: "O(1)",
        stable: true,
        inplace: true,
        metrics: { swaps: false, writes: false },
        desc: "Leverages the many-worlds interpretation of quantum mechanics. Checks if the array is sorted; if not, the universe is destroyed. By the anthropic principle, the only universe in which an observer can exist is one where the array is already sorted, guaranteeing an O(n) check with no comparisons wasted on sorting. Requires a quantum computer capable of collapsing universes. Performance figures assume successful universal survival.",
    },
    {
        name: "Tournament Sort",
        fn: tournamentSort,
        time_worst: "O(n log n)",
        time_avg: "O(n log n)",
        time_best: "O(n log n)",
        aux: "O(n)",
        stable: false,
        inplace: false,
        metrics: { swaps: false },
        desc: "Simulates an elimination tournament. Builds a winner tree in O(n) by having all elements compete pairwise from the leaves up. The root holds the overall minimum. Each extraction reads the root, retires that leaf by setting it to infinity, then replays only the single root-to-leaf path in O(log n) to find the next minimum. Repeating this n times yields a sorted sequence. The explicit winner-index tree makes the O(log n) replay intuitive: only nodes on the winning path can change.",
    },
    {
        name: "Introspective Sort",
        fn: introspectiveSort,
        time_worst: "O(n log n)",
        time_avg: "O(n log n)",
        time_best: "O(n)",
        aux: "O(log n)",
        stable: false,
        inplace: true,
        desc: "A hybrid of quicksort, heapsort, and insertion sort. Starts with quicksort for its practical speed, but tracks recursion depth: if it exceeds 2 * floor(log2(n)), indicating bad pivot choices, it switches to heapsort to guarantee O(n log n) worst case. Small subarrays of 16 or fewer elements fall through to insertion sort, which has low overhead at small sizes. The result is quicksort\u2019s average-case performance with heapsort\u2019s worst-case guarantee. Used in most production sort implementations including C++ std::sort.",
    },
].sort((a, b) => a.name.localeCompare(b.name));

export const ALGO_MAP = Object.fromEntries(ALGOS.map((a) => [a.name, a.fn]));
export const ALGO_INFO = Object.fromEntries(ALGOS.map((a) => [a.name, a]));
export const ALGO_NAMES = ALGOS.map((a) => a.name);
