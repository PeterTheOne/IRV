var result = $('#result');

$(function() {

    $('#candidates').change(updateButton).keydown(updateButton);
    $('#ballots').change(updateButton).keydown(updateButton);
    $('#incompleteBallots').change(updateButton);

    function updateButton() {
        $('#submit').html('Submit').removeClass('btn-success').addClass('btn-primary');
    }

    $('#submit').click(function(event) {
        event.preventDefault();
        result.html('');
        $('#submit').html('Re-Submit').removeClass('btn-primary').addClass('btn-success');
        $('#result-group').show();

        var incompleteBallots = $('#incompleteBallots').is(':checked');
        var candidateNames = $('#candidates').val().split('\n');
        var ballots = Irv.readBallots($('#ballots').val());

        if (Irv.validateInput(candidateNames, ballots, incompleteBallots)) {
            Irv.calculateWinner(candidateNames, ballots);
        }

        $('html, body').animate({scrollTop: $(document).height()}, 'slow');
    });

});