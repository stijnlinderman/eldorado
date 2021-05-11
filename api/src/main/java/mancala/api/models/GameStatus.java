package mancala.api.models;

public class GameStatus {
    boolean endOfGame;
    public boolean getEndOfGame() { return endOfGame; }
    
    String winner;
    public String getWinner() { return winner; }

    public GameStatus(mancala.domain.Mancala mancala, 
            String namePlayer1, String namePlayer2) {
        this.endOfGame = mancala.isEndOfGame();
        int winner = mancala.getWinner();
        if(winner == mancala.NO_PLAYERS) {
            this.winner = null;
        } else if(winner == mancala.PLAYER_ONE) {
            this.winner = namePlayer1;
        } else if(winner == mancala.PLAYER_TWO) {
            this.winner = namePlayer2;
        } else {
            this.winner = namePlayer1  + "and" + namePlayer2;
        }
    }
}