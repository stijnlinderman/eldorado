package mancala.api.models;

public class Pit {
	int index;

	public int getIndex() {
		return index;
	}

	int nrOfStones;

	public int getNrOfStones() { return nrOfStones; }

	public Pit(int index, int nrOfStones) {
		this.index = index;
		this.nrOfStones = nrOfStones;
	}
}