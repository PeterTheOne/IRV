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
    deepEqual(Irv.readBallots(ballotsText), [[1, 2, 3]], 'Read ballot with many spaces.');

    ballotsText = '1, 2, 3\n3, 2, 1\n1, 2, 3';
    deepEqual(Irv.readBallots(ballotsText), [[1, 2, 3], [3, 2, 1], [1, 2, 3]], 'Read multiple ballots.');

    ballotsText = '0, 0, 0';
    deepEqual(Irv.readBallots(ballotsText), [[0, 0, 0]], 'Read empty ballot.');

    ballotsText = ',,\n , , ';
    deepEqual(Irv.readBallots(ballotsText), [[0, 0, 0], [0, 0, 0]], 'Read ballot with missing ranking.');
});

test('validateCandidates', function() {
    ok(Irv.validateCandidates(['Obama', 'Putin', 'Merkel']));
    ok(!Irv.validateCandidates([]), 'Empty candidates array is invalid.');
    ok(!Irv.validateCandidates(['']), 'Empty candidateName is invalid.');
    ok(!Irv.validateCandidates(['Obama', '', 'Merkel']), 'Empty candidateName is invalid.');
});

test('validateBallots', function() {
    ok(Irv.validateBallots([[1, 2, 3], [1, 2, 3]]));
    ok(!Irv.validateBallots([]), 'Empty ballots array is invalid.');
    ok(!Irv.validateBallots([[]]), 'Empty ballot is invalid.');
    ok(!Irv.validateBallots([[1, 2, 3], [], [1, 2, 3]]), 'Empty candidateName is invalid.');
});

test('validateInput', function() {
    var candidates = ['Obama', 'Putin', 'Merkel'];
    var ballots = [[1, 2, 3], [3, 2, 1], [1, 3, 2], [2, 1, 3]];
    var threshold = 50;
    ok(Irv.validateInput(candidates, ballots, false, threshold));

    // todo: write more test for validateInput
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

test('countFirstVotes', function() {
    var ballots = [[1, 2, 3], [2, 1, 3], [2, 1, 3], [3, 2, 1], [3, 2, 1], [3, 2, 1]];

    deepEqual(Irv.countFirstVotes(3, ballots), [1, 2, 3]);
    deepEqual(Irv.countFirstVotes(3, []), [0, 0, 0]);
    deepEqual(Irv.countFirstVotes(3, [[0, 0, 0], [0, 0, 0]]), [0, 0, 0]);
    deepEqual(Irv.countFirstVotes(3, [[0, -1, -2]]), [0, 0, 0]);
    deepEqual(Irv.countFirstVotes(3, [[0, 1, 0], [0, 0, 1], [0, 0, 1]]), [0, 1, 2]);
});

test('countNVotes', function() {
    var ballots = [[1, 2, 3], [2, 1, 3], [2, 1, 3], [3, 2, 1], [3, 2, 1], [3, 2, 1]];

    deepEqual(Irv.countNVotes(2, 3, ballots), [2, 4, 0]);
    deepEqual(Irv.countNVotes(1, 3, []), [0, 0, 0]);
    deepEqual(Irv.countNVotes(1, 3, [[0, 0, 0], [0, 0, 0]]), [0, 0, 0]);
    deepEqual(Irv.countNVotes(1, 3, [[0, -1, -2]]), [0, 0, 0]);
    deepEqual(Irv.countNVotes(1, 3, [[0, 1, 0], [0, 0, 1], [0, 0, 1]]), [0, 1, 2]);
});

test('calculateRoundWinners', function() {
    deepEqual(Irv.calculateRoundWinners([1, 0, 0]), [0]);
    deepEqual(Irv.calculateRoundWinners([1, 1, 1]), [0, 1, 2]);
    deepEqual(Irv.calculateRoundWinners([1, 2, 2]), [1, 2]);
    deepEqual(Irv.calculateRoundWinners([7, 5, 99]), [2]);
});

test('calculateRoundLosers', function() {
    deepEqual(Irv.calculateRoundLosers([2, 1, 0], 3), [2]);
    deepEqual(Irv.calculateRoundLosers([1, 1, 1], 3), [0, 1, 2]);
    deepEqual(Irv.calculateRoundLosers([2, 1, 1], 3), [1, 2]);
    deepEqual(Irv.calculateRoundLosers([7, 5, 99], 111), [1]);
    deepEqual(Irv.calculateRoundLosers([0, 1, 0], 3), [0, 2]);
});

test('calculateRoundLosersOfCandidates', function() {
    deepEqual(Irv.calculateRoundLosersOfCandidates([0, 1, 2], [2, 1, 0], 3), [2], 'Calculate round losers of all candidates.');
    deepEqual(Irv.calculateRoundLosersOfCandidates([0, 1], [2, 1, 0], 3), [1], 'Calculate round losers of only the first two candidates.');
    deepEqual(Irv.calculateRoundLosersOfCandidates([0, 1, 2], [0, 1, 0], 3), [0, 2]);
});

test('removeLoserCandidate', function() {
    deepEqual(Irv.removeLoserCandidate(['Obama', 'Putin', 'Merkel'], 0), ['Putin', 'Merkel']);
    deepEqual(Irv.removeLoserCandidate(['Obama', 'Putin', 'Merkel'], 1), ['Obama', 'Merkel']);
    deepEqual(Irv.removeLoserCandidate(['Obama', 'Putin', 'Merkel'], 2), ['Obama', 'Putin']);
});

test('removeLoserFromBallots', function() {
    deepEqual(Irv.removeLoserFromBallots([[1, 2, 3, 4]], 1), [[1, 2, 3]], 'Remove loser and fix ranking.');
    deepEqual(Irv.removeLoserFromBallots([[1, 2, 3, 4]], 0), [[1, 2, 3]], 'Remove loser and fix ranking.');
    deepEqual(Irv.removeLoserFromBallots([[1, 2, 4, 3]], 0), [[1, 3, 2]], 'Remove loser and fix ranking.');
    deepEqual(Irv.removeLoserFromBallots([[0, 1, 0]], 1), [], 'Remove empty ballots.');
    deepEqual(Irv.removeLoserFromBallots([[2, 1, 0, 0]], 2), [[2, 1, 0]], 'Don\'t make ones to zeros.');
});

test('calculateWinner', function() {
    var candidates = ['Obama', 'Putin', 'Merkel'];
    var ballots = [[1, 2, 3], [1, 2, 3], [1, 2, 3], [1, 2, 3], [3, 1, 2], [2, 1, 3], [3, 2, 1]];
    var threshold = 50;
    deepEqual(Irv.calculateWinner(candidates, ballots, false, threshold), ['Obama']);

    candidates = ['Obama', 'Putin', 'Merkel'];
    ballots = [[1, 2, 3], [1, 2, 3], [1, 2, 3], [1, 2, 3], [3, 1, 2], [3, 1, 2], [3, 2, 1], [3, 2, 1], [3, 2, 1]];
    deepEqual(Irv.calculateWinner(candidates, ballots, false, 50), ['Merkel']);

    candidates = ['Obama', 'Putin', 'Merkel'];
    ballots = [[1, 2, 3], [1, 2, 3], [1, 2, 3], [1, 2, 3], [3, 1, 2], [3, 1, 2], [3, 2, 1], [3, 2, 1], [3, 2, 1]];
    deepEqual(Irv.calculateWinner(candidates, ballots, false, 40), ['Obama']);


    // todo: test more examples.
});
