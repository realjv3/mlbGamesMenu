/**
 * Renders the selected game's info on canvas above & below the menu item
 *
 * @param {Array.<Object>} games
 * @param {number} selGame
 * @param {Array.<number>} selPositions
 */
export default function renderGameText(games, selGame, selPositions) {
    const
        canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d');
    canvas.width = 1024;
    canvas.height = 576;
    ctx.fillStyle = "#FFF";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const
        game = games[selGame],
        dateTime = new Date(game.gameDate).toLocaleString(),
        awayTeam = game.teams.away,
        homeTeam = game.teams.home,
        headline = `${awayTeam.team.name} vs. ${homeTeam.team.name}`,
        awayRecord = `W: ${awayTeam.leagueRecord.wins} L: ${awayTeam.leagueRecord.losses} Pct: ${awayTeam.leagueRecord.pct}`,
        homeRecord = `W: ${homeTeam.leagueRecord.wins} L: ${homeTeam.leagueRecord.losses} Pct: ${homeTeam.leagueRecord.pct}`;

    // convert from clipspace to pixels
    var pixelX = Math.floor((selPositions[0] *  0.5 + 0.5) * canvas.width) + 62;
    var pixelY = Math.floor((selPositions[1] * -0.5 + 0.5) * canvas.height) - 10;

    ctx.font = "11px Arial";
    ctx.fillText(headline, pixelX, pixelY);
    ctx.font = "9px Arial";
    ctx.fillText(dateTime, pixelX, pixelY + 100);
    ctx.fillText(awayRecord, pixelX, pixelY + 110);
    ctx.fillText(homeRecord, pixelX, pixelY + 120);
}
