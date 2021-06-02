/*
 * This Java source file was generated by the Gradle 'init' task.
 */
package eldorado.domain;

//import static org.junit.Assert.*;
//import org.junit.Test;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class DeckTest {
    
    @Test
    public void checkStartingDeckConfiguration() {
    	Deck deck = new Deck();
		assertEquals(8, deck.getDeck().size());
		assertEquals(0, deck.getHand().size());
		assertEquals(0, deck.getDiscarded().size());
    }
    
    @Test public void checkConfigurationAfterFourCardsWereDrawn() {
    	Deck deck = new Deck();
    	deck.draw(4);
		assertEquals(4, deck.getDeck().size());
		assertEquals(4, deck.getHand().size());
		assertEquals(0, deck.getDiscarded().size());
    }
}
