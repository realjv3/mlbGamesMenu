import {renderGL} from "./gl";
import {getGames} from "./games";
import renderGameText from "./canvas";

window.onload = () => {
	let
		mlbGames = [],
		selGame = 0,
		selPositions = [];

	getGames()
		.then(games => {
			mlbGames = games.dates[0].games;
			selPositions = renderGL(mlbGames);
			renderGameText(mlbGames, selGame, selPositions);
		});

	document.body.onkeydown = e => {
		switch (e.key) {
			case 'ArrowLeft':
				selGame = selGame > 0 ? selGame - 1 : 0;
				break;
			case 'ArrowRight':
				selGame = selGame !== mlbGames.length - 1 ? selGame + 1 : mlbGames.length - 1;
				break;
			case 'Enter':
		}

		if (['ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key)) {

			selPositions = renderGL(mlbGames, selGame);
			renderGameText(mlbGames, selGame, selPositions);
		}
	}
};
