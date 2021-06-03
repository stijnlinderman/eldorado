/*
 * This Java source file was generated by the Gradle 'init' task.
 */
package eldorado.domain;

import java.util.ArrayList;
import java.util.Random;

public class Deck {
	private ArrayList<String> deck;
	private ArrayList<String> hand;
	private ArrayList<String> discarded;
	private int maxCardsInHand = 4;
	
	private static String[] defaultStarterDeck = {
			CardType.sailor,
			CardType.explorer,
			CardType.explorer,
			CardType.explorer,
			CardType.traveler,
			CardType.traveler,
			CardType.traveler,
			CardType.traveler
	};
    private static Random random = new Random();
	
	public Deck () {
		this.deck = createStarterDeck();
		this.hand = new ArrayList<String>();
		this.discarded = new ArrayList<String>();
	}
	
	private static ArrayList<String> createStarterDeck () {
		ArrayList<String> starterDeck = new ArrayList<String>();
		for (int i=0; i<defaultStarterDeck.length; i++) {
			starterDeck.add(defaultStarterDeck[i]);
		}
		return starterDeck;
	}
	
	public void draw (int amountToDraw) {
		if (amountToDraw > 0) {
			if (this.getDeck().size() == 0) {
				this.recreateDeckFromDiscardedCards();
			}
			String randomCardFromDeck = this.deck.get(random.nextInt(this.deck.size()));
			this.deck.remove(randomCardFromDeck);
			this.hand.add(randomCardFromDeck);

			this.draw(amountToDraw - 1);
		}
	}
	
	private void recreateDeckFromDiscardedCards () {
		this.deck = this.getDiscarded();
		this.discarded = new ArrayList<String>();
	}
	
	public void discard (String discardedCard) {
		this.getHand().remove(discardedCard);
		this.getDiscarded().add(discardedCard);
	}
	
	public void refillHand () {
		int cardsToDraw = maxCardsInHand - this.getHand().size();
		this.draw(cardsToDraw);
	}
	
	public ArrayList<String> getDeck () {
		return this.deck;
	}
	
	public ArrayList<String> getHand () {
		return this.hand;
	}
	
	public ArrayList<String> getDiscarded () {
		return this.discarded;
	}
	
	public boolean handContainsCard (String card) {
		return (this.getHand().contains(card));
	}
	
	public class CardType {
		public static final String explorer = "explorer";
		public static final String sailor = "sailor";
		public static final String traveler = "traveler";
	}
}