package mancala.api.models;

// This package is a collection of DTO's (data transfer objects).
// A DTO is a simple datastructure which models the
// data your web API sends back to the client. The Java
// objects will be converted to JSON objects.
public class Mancala {
    public Mancala(mancala.domain.Mancala mancala, 
            String namePlayer1, String namePlayer2) {
        players = new Player[2];
        players[0] = new Player(mancala, namePlayer1, true);
        players[1] = new Player(mancala, namePlayer2, false);
        gameStatus = new GameStatus(mancala, namePlayer1, namePlayer2);
    }

    Player[] players;
    public Player[] getPlayers() { return players; }
    
    GameStatus gameStatus;
    public GameStatus getGameStatus() { return gameStatus; }
}