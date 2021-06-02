/*
 * This Java source file was generated by the Gradle 'init' task.
 */
package eldorado.api.dto;

import java.util.ArrayList;
import eldorado.domain.*;

public class DeckStateDTO {
	public final int deckAmountLeft;
	public final String[] hand;
	public final int discardedAmount;

	public DeckStateDTO (Deck deck) {
		this.deckAmountLeft = deck.getDeck().size();
		this.hand = createArrayOfStringsRepresentingCardsInHand(deck.getHand());
		this.discardedAmount = deck.getDiscarded().size();
	}
		
	private static String[] createArrayOfStringsRepresentingCardsInHand (ArrayList<String> deckCardsInHand) {
		String[] cardsArray = new String[deckCardsInHand.size()];
		int i = 0;
		for (String card : deckCardsInHand) {
			cardsArray[i] = card;
			i++;
		}
		return cardsArray;
	}
}