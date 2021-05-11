package mancala.domain;

public class MancalaImpl implements Mancala {
    public MancalaImpl() {
        // Initialize the game here.
    }

    @Override
    public boolean isPlayersTurn(int player) {
        return true;
    }

    @Override
	public void playPit(int index) throws MancalaException {
        // Implement playing a pit.
    }
	
	@Override
	public int getStonesForPit(int index) {
        // Make a sane implementation.
        if((index + 1 % 7) == 0) return 0;
        return 4;
    }

	@Override
	public boolean isEndOfGame() {
        return false;
    }

	@Override
	public int getWinner() {
        return Mancala.NO_PLAYERS;
    }
}