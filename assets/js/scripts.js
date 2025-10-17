var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,

    ships: [
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] },
    ],

    fire: function (guess) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess); // Searches through table to find guess and returns index
            if (ship.hits[index] === "hit") {
                view.displayMessage("Hit on known target!");
                return true;
            } else if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("Confirmed hit on target!");
                if (this.isSunk(ship)) {
                    view.displayMessage("Enemy vessel sunk!");
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("Negative hit!");
        return false;
    },

    isSunk: function (ship) {
        for (i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    },

    generateShipLocations: function () {
        var locations;
        for (var i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
        console.log("Ship Table: ");
        console.log(this.ships);
    },

    generateShip: function () {
        var direction = Math.floor(Math.random() * 2);
        var row, col;

        if (direction === 1) {
            //Horizontal Arrangement
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(
                Math.random() * (this.boardSize - this.shipLength)
            );
        } else {
            //Vertical Arrangement
            row = Math.floor(
                Math.random() * (this.boardSize - this.shipLength)
            );
            col = Math.floor(Math.random() * this.boardSize);
        }

        var newShipLocations = [];
        for (var i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i));
            } else {
                newShipLocations.push(row + i + "" + col);
            }
        }
        return newShipLocations;
    },

    collision: function (locations) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            for (var j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    },
};

var view = {
    displayMessage: function (msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },

    displayHit: function (location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },

    displayMiss: function (location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    },
};

var controller = {
    guesses: 0,
    processGuess: function (location) {
        if (location) {
            this.guesses++;
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage(
                    "Scope is clear, all hostile contacts sunk! " +
                        this.guesses +
                        " salvoes expended!"
                );
                var end = (document.getElementById(
                    "guessInput"
                ).disabled = true);
            }
        }
    },
};

window.onload = init;

function init() {
    var guessClick = document.getElementsByTagName("td");
    for (var i = 0; i < guessClick.length; i++) {
        guessClick[i].onclick = answer;
    }

    model.generateShipLocations();
    view.displayMessage(
        "Lookouts reporting three enemy contacts in the area, each three units long."
    );
}

function answer(eventObj) {
    var shot = eventObj.target;
    var location = shot.id;
    controller.processGuess(location);
}
