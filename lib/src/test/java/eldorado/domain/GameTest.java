/*
 * This Java source file was generated by the Gradle 'init' task.
 */
package eldorado.domain;

//import static org.junit.Assert.*;
//import org.junit.Test;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Map;

public class GameTest {
	
    @Test 
    public void newFieldHasCenterPos() {
    	Game game = new Game(0);
        assertNotNull(game.getMap().getField(0, 0, 0));
    }
    
    @Test
    public void firstPawnHasAStartingPoint() {
    	Game game = new Game(0);
    	boolean foundFirstPawnStartingPoint = false;
		for (Map.Entry<String, Field> fieldEntry: game.getMap().fields.entrySet()) {
			if (fieldEntry.getValue().getPawnId() == 1) {
				foundFirstPawnStartingPoint = true;
			}
		}
		assertTrue(foundFirstPawnStartingPoint);
    }
}