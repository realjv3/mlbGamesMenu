export const getGames = () => {

	const
		now = new Date(),
		year = now.getFullYear(),
		month = `${now.getMonth() + 1}`.padStart(2, '0'),
		day = `${now.getDate()}`.padStart(2, '0');
		return fetch(
			`http://statsapi.mlb.com/api/v1/schedule?hydrate=game(content(editorial(recap))),decisions&date=${year}-${month}-${day}&sportId=1`
		)
			.then(resp => resp.json());
}