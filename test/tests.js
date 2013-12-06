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