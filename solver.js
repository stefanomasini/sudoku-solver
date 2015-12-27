const _ = 0;

const allNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function valuesInRow(state, r) {
    return new Set(state[r].filter(v => v > 0));
}

function valuesInCol(state, c) {
    return new Set(state.map(row => row[c]).filter(v => v > 0));
}

function valuesInBlock(state, r, c) {
    var chunks = state.filter((row, ridx) => Math.floor(ridx / 3) === Math.floor(r / 3))
        .map(row => row.filter((col, cidx) => Math.floor(cidx / 3) === Math.floor(c / 3)));
    return new Set([].concat.apply([], chunks).filter(v => v > 0));
}


function findOptionsForState(state) {
    return state.map((row, rowIdx) => row.map((cell, colIdx) => findOptionsForCell(state, rowIdx, colIdx)));
}

function findOptionsForCell(state, r, c) {
    if (state[r][c] > 0) {
        return null;
    }
    const invalidNumbers = new Set([
        ...valuesInRow(state, r),
        ...valuesInCol(state, c),
        ...valuesInBlock(state, r, c),
    ])
    return allNumbers.filter(n => !invalidNumbers.has(n));
}

function sortOptions(state) {
    var result = [];
    state.forEach((row, rowIdx) => row.forEach((options, colIdx) => {
        if (options !== null) {
            result.push([rowIdx, colIdx, options]);
        }
    }));
    result.sort((a, b) => a[2].length - b[2].length);
    return result;
}

function applyMove(state, r, c, value) {
    return state.map((row, rowIdx) => rowIdx !== r ? row :
        row.map((cell, colIdx) => colIdx !== c ? cell : value)
    );
}

function findSolutions(state) {
    const options = sortOptions(findOptionsForState(state));
    if (options.length === 0) {
        // Solved!
        solutions.add(state);
        return;
    }
    const [row, col, possibleValues] = options[0];
    if (possibleValues.length === 0) {
        // Dead end
        return;
    }
    possibleValues.forEach(value => {
        findSolutions(applyMove(state, row, col, value));
    });
}

// ----------------------------------------

function pprintState(state) {
    return state.map(row => row.map(value => value > 0 ? `${value}` : '.').join('') + '\n').join('')
}

//const initialState = [
//    [5, _, _, _, _, _, 9, 4, _],
//    [_, _, _, 5, 6, 7, _, _, _],
//    [_, 1, 8, _, _, _, _, _, _],
//    [_, _, _, 3, _, 8, _, _, 5],
//    [2, 8, _, _, _, _, _, 6, 1],
//    [4, _, _, 6, _, 2, _, _, _],
//    [_, _, _, _, _, _, 8, 3, _],
//    [_, _, _, 1, 2, 9, _, _, _],
//    [_, 6, 5, _, _, _, _, _, 7],
//];

//const initialState = [
//    [_, _, _, _, _, _, 6, 8, _],
//    [_, _, _, _, 7, 3, _, _, 9],
//    [3, _, 9, _, _, _, _, 4, 5],
//    [4, 9, _, _, _, _, _, _, _],
//    [8, _, 3, _, 5, _, 9, _, 2],
//    [_, _, _, _, _, _, _, 3, 6],
//    [9, 6, _, _, _, _, 3, _, 8],
//    [7, _, _, 6, 8, _, _, _, _],
//    [_, 2, 8, _, _, _, _, _, _],
//];

const initialState = [
    [_, _, 9, 7, 4, 8, _, _, _],
    [7, _, _, _, _, _, _, _, _],
    [_, 2, _, 1, _, 9, _, _, _],
    [_, _, 7, _, _, _, 2, 4, _],
    [_, 6, 4, _, 1, _, 5, 9, _],
    [_, 9, 8, _, _, _, 3, _, _],
    [_, _, _, 8, _, 3, _, 2, _],
    [_, _, _, _, _, _, _, _, 6],
    [_, _, _, 2, 7, 5, 9, _, _],
];

var solutions = new Set();
findSolutions(initialState);
console.log(`${solutions.size} solutions\n`);
solutions.forEach(sol => {
    console.log(pprintState(sol));
});
