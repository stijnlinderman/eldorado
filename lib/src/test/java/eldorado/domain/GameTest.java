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
	
	private static final String[][][] mapTestConfigurations = {
			{
				{"0,0,0", "0"},
				{"0,1,1", "1"},
				{"0,3,3", "0"},
				{"0,4,4", "0"},
				{"1,0,1", "0"},
				{"1,1,2", "0"},
				{"1,2,3", "0"},
				{"1,3,4", "0"},
				{"2,0,2", "0"},
				{"2,2,4", "0"},
				{"2,3,5", "0"},
				{"3,-1,2", "0"},
				{"3,0,3", "0"},
				{"3,2,5", "0"}
			}
		};
	
    @Test 
    public void newFieldHasCenterPos() {
    	Game game = new Game(mapTestConfigurations[0]);
        assertNotNull(game.getMap().getField(0, 0, 0));
    }
    
    @Test
    public void firstPawnHasAStartingPoint() {
    	Game game = new Game(mapTestConfigurations[0]);
    	boolean foundFirstPawnStartingPoint = false;
		for (Map.Entry<String, Field> fieldEntry: game.getMap().fields.entrySet()) {
			if (fieldEntry.getValue().getPawnId() == 1) {
				foundFirstPawnStartingPoint = true;
			}
		}
		assertTrue(foundFirstPawnStartingPoint);
    }
    
    @Test
    public void fieldExists () {
    	Game game = new Game(mapTestConfigurations[0]);
    	assertNotNull (game.getMap().getField(0, 1, 1));
    }
    
    @Test
    public void fieldsDoesNotExist () {
    	Game game = new Game(mapTestConfigurations[0]);
    	assertNull (game.getMap().getField(-1, -1, -1));
    }
    
    @Test
    public void fieldHasNeighborThatContainsThePawn () {
		Game game = new Game(mapTestConfigurations[0]);
		assertNotNull(game.getMap().findNeighboringFieldThatCurrentlyContainsPawn(0, 0, 0, 1));
    }
    
    @Test
    public void fieldHasNeighborThatDoesNotContainThePawn () {
		Game game = new Game(mapTestConfigurations[0]);
		assertNotNull(game.getMap().findNeighboringFieldThatCurrentlyContainsPawn(3, 2, 5, 1));
    }
}
