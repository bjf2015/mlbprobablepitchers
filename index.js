'use strict';


const Xray = require('x-ray');


const internals = {};


module.exports = internals.Probables = {};


internals.Probables.get = function (day, callback) {

    const url = `http://mlb.mlb.com/news/probable_pitchers/index.jsp?c_id=mlb&date=${day}`;
    const scope = 'div#mc';
    const selector = {
        pitchers: ['div.pitcher@pid'],
        teams: ['div.pitcher@tid'],
        games: ['div.pitcher@gid']
    };

    const x = Xray();
    x(url, scope, selector)((err, result) => {

        if (err) {
            return callback(err);
        }

        const matchups = internals.convertResult(result);
        return callback(null, matchups);
    });
};


internals.convertResult = function (result) {

    const matchups = [];

    const pitchers = result.pitchers;
    const teams = result.teams;
    const games = result.games;

    for (let i = 0; i < pitchers.length; i += 2) {
        const j = i + 1;
        const matchup = {
            id: games[i],
            teams: {
                away: teams[i],
                home: teams[j]
            },
            pitchers: {
                away: pitchers[i],
                home: pitchers[j]
            }
        };

        matchups.push(matchup);
    }

    return matchups;
};
