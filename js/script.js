var result = $('#result');

$(function() {

    $('#submit').click(function(event) {
        event.preventDefault();
        result.html('');
        $('#result-group').show();

        var incompleteBallots = $('#incompleteBallots').is(':checked');
        var candidateNames = $('#candidates').val().split('\n');
        var ballots = Irv.readBallots($('#ballots').val());
        if (Irv.validateInput(candidateNames, ballots, incompleteBallots)) {
            Irv.calculateWinner(candidateNames, ballots);
        }
    });

});