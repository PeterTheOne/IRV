var result = $('#result');

function createZeroFilledArray(length) {
    return Array.apply(null, new Array(length)).map(Number.prototype.valueOf,0);
}

function readBallots() {
    var ballots = $('#ballots').val().split('\n');
    for (var i = 0; i < ballots.length; i++) {
        ballots[i] = ballots[i].replace(/\s+/g, '');
        ballots[i] = ballots[i].split(',');
        for (var j = 0; j < ballots[i].length; j++) {
            ballots[i][j] = parseInt(ballots[i][j]);
        }
    }
    return ballots;
}

function validateInput(candidates, ballots) {
    if (candidates.length == 1 && $.trim(candidates['0']) === '') {
        result.append('You didn\'t enter any candidates!<br />');
        return false;
    }

    if (ballots.length == 1 && $.trim(ballots['0']) === '') {
        result.append('You didn\'t enter any ballots!<br />');
        return false;
    }

    for (var i = 0; i < ballots.length; i++) {
        if (ballots[i].length !== candidates.length) {
            result.append('Ballot #' + (i + 1) + ' doesn\'t have the same ' +
                'length as there are canidates.<br />');
            return false;
        }
        var numbers = createZeroFilledArray(candidates.length);
        for (var j = 0; j < ballots[i].length; j++) {
            if (ballots[i][j] < 1 || ballots[i][j] > candidates.length) {
                result.append('Ballot #' + (i + 1) + ' Number #' + (j + 1) +
                    ' isn\'t a number between 1 and the number of canidates.<br />');
                return false;
            }
            numbers[ballots[i][j] - 1]++;
        }
        for (var k = 0; k < numbers.length; k++) {
            if (numbers[k] !== 1) {
                result.append('Ballot #' + (i + 1) + ' doesn\'t have exactly one of every number.<br />');
                return false;
            }
        }
    }

    return true;
}

$(function() {

    $('#submit').click(function(event) {
        event.preventDefault();
        result.html('');
        $('#result-group').show();

        var candidateNames = $('#candidates').val().split('\n');
        var ballots = readBallots();
        if (!validateInput(candidateNames, ballots)) {
            return;
        }
        result.append('You entered ' + candidateNames.length + ' candidates and ' +
            ballots.length + ' ballots.<br />');

        var round = 0;
        do {
            result.append('<br />Round #'+ (round + 1) +':<br />');

            var firstVotesCount = createZeroFilledArray(candidateNames.length);
            for (var i = 0; i < ballots.length; i++) {
                for (var j = 0; j < ballots[i].length; j++) {
                    if (ballots[i][j] === 1) {
                        firstVotesCount[j]++;
                    }
                }
            }

            var maxVotes = -1;
            var minVotes = ballots.length + 1;
            var roundWinners = [];
            var roundLosers = [];
            for (i = 0; i < firstVotesCount.length; i++) {
                if (firstVotesCount[i] > maxVotes) {
                    maxVotes = firstVotesCount[i];
                    roundWinners = [];
                    roundWinners.push(i);
                } else if (firstVotesCount[i] == maxVotes) {
                    roundWinners.push(i);
                }
                if (firstVotesCount[i] < minVotes) {
                    minVotes = firstVotesCount[i];
                    roundLosers = [];
                    roundLosers.push(i);
                } else if (firstVotesCount[i] == minVotes) {
                    roundLosers.push(i);
                }
            }
            var ratioOfWinnerVotes = firstVotesCount[roundWinners[0]] / ballots.length;
            var ratioOfLoserVotes = firstVotesCount[roundLosers[0]] / ballots.length;

            result.append('<br />Number of first votes per Candidate:<br />');
            for (i = 0; i < candidateNames.length; i++) {
                result.append(candidateNames[i] + ': ' + firstVotesCount[i] + '<br />');
            }

            if (roundWinners.length === 1) {
                result.append('<br />' + candidateNames[roundWinners[0]] + ' has the highest number of votes with ' +
                    firstVotesCount[roundWinners[0]] + ' votes (' + (100 * ratioOfWinnerVotes)+
                    '%)<br />');
            } else {
                result.append('<br />' + roundWinners.length + ' candidates have the highest number of votes with ' +
                    firstVotesCount[roundWinners[0]] + ' votes (' + (100 * ratioOfWinnerVotes)+
                    '%)<br />');
            }
            if (roundLosers.length === 1) {
                result.append(candidateNames[roundLosers[0]] + ' has the lowest number of votes with ' +
                    firstVotesCount[roundLosers[0]] + ' votes (' + (100 * ratioOfLoserVotes)+
                    '%)<br />');
            } else {
                result.append(firstVotesCount.length + ' candidates have the lowest number of votes with ' +
                    firstVotesCount[roundLosers[0]] + ' votes (' + (100 * ratioOfLoserVotes)+
                    '%)<br />');
            }

            var roundWinner = roundWinners[0];
            var roundLoser = roundLosers[0];

            if (ratioOfWinnerVotes > 0.5) {
                result.append('<br />' + candidateNames[roundWinner] + ' won!<br />');
                break;
            }

            if (candidateNames.length == 2) {
                result.append('<br />There are two candidates left and no one has over 50% of the votes.<br />');
                break;
            }

            if (roundLosers.length > 1) {
                var randomIndex = Math.round(Math.random() * (roundWinners.length - 1));
                roundLoser = roundLosers[randomIndex];
                result.append(candidateNames[roundLoser] + ' was randomly selected as the loser of the round.<br />');
            }

            for (i = 0; i < ballots.length; i++) {
                var loserRank = ballots[i][roundLoser];
                for (j = 0; j < ballots.length; j++) {
                    if (ballots[i][j] > loserRank) {
                        ballots[i][j] = ballots[i][j] - 1;
                    }
                }
                ballots[i].splice(roundLoser, 1);
            }
            candidateNames.splice(roundLoser, 1);

            round++;
        } while(true);

    });

});