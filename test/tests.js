test('createZeroFilledArray', function() {
    deepEqual(Irv.createZeroFilledArray(0), [], 'Create zero filled array of length 0.');
    deepEqual(Irv.createZeroFilledArray(1), [0], 'Create zero filled array of length 1.');
    deepEqual(Irv.createZeroFilledArray(3), [0, 0, 0], 'Create zero filled array of length 5.');
    deepEqual(Irv.createZeroFilledArray(5), [0, 0, 0, 0, 0], 'Create zero filled array of length 5.');
    deepEqual(Irv.createZeroFilledArray(-1), [], 'Create zero filled array of length -1.');
});

test('readBallots', function() {
    var ballotsText = '1, 2, 3';
    deepEqual(Irv.readBallots(ballotsText), [[1, 2, 3]], 'Read normal ballot.');

    ballotsText = '1,2,3';
    deepEqual(Irv.readBallots(ballotsText), [[1, 2, 3]], 'Read ballot without spaces.');

    ballotsText = '   1   ,   2   ,  3   ';
    deepEqual(Irv.readBallots(ballotsText), [[1, 2, 3]], 'Read ballot many spaces.');

    ballotsText = '1, 2, 3\n3, 2, 1\n1, 2, 3';
    deepEqual(Irv.readBallots(ballotsText), [[1, 2, 3], [3, 2, 1], [1, 2, 3]], 'Read multiple ballots.');

    ballotsText = '0, 0, 0';
    deepEqual(Irv.readBallots(ballotsText), [[0, 0, 0]], 'Read empty ballot.');

    ballotsText = ',,\n , , ';
    deepEqual(Irv.readBallots(ballotsText), [[0, 0, 0], [0, 0, 0]], 'Read ballot with missing ranking.');
});

test('removeEmptyBallots', function() {
    var noBallots = [];
    deepEqual(Irv.removeEmptyBallots(noBallots), [], 'Don\'t change empty array.');

    var oneEmptyBallot = [
        [0, 0, 0]
    ];
    deepEqual(Irv.removeEmptyBallots(oneEmptyBallot), [], 'Remove empty ballot.');

    var mixedBallots = [
        [0, 0, 0],
        [3, 2, 1],
        [1, 3, 2],
        [0, 0, 0],
        [1, 2, 3],
        [0, 0, 0]
    ];
    deepEqual(Irv.removeEmptyBallots(mixedBallots), [[3, 2, 1], [1, 3, 2], [1, 2, 3]], 'Remove multiple empty ballots from Mixed array.');

    var nonEmptyBallots = [
        [3, 0, 0],
        [1, 0, 3],
        [0, 1, 0]
    ];
    deepEqual(Irv.removeEmptyBallots(nonEmptyBallots), [[3, 0, 0], [1, 0, 3], [0, 1, 0]], 'Don\'t remove almost empty ballots.');

    var invalidBallots = [
        [-1, -13, -97],
        [3, 2, 1],
        [0, -1, 0]
    ];
    deepEqual(Irv.removeEmptyBallots(invalidBallots), [[3, 2, 1]], 'Also remove invalid ballots.');
});