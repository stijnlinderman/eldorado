package mancala.api;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import jakarta.servlet.http.*;
import jakarta.ws.rs.core.*;

import mancala.api.models.*;
import mancala.domain.MancalaImpl;

public class StartMancalaTest {
    @Test
    public void startingMancalaShouldBeAllowed() {
        var response = startMancala("Mario", "Luigi");
        assertEquals(200, response.getStatus());
    }

    @Test
    public void startingMancalaReturnsAGameWithoutAWinner() {
        var response = startMancala("Mario", "Luigi");
        var entity = (Mancala)response.getEntity();
        var gameState = entity.getGameStatus();
        assertFalse(gameState.getEndOfGame());
        assertNull(gameState.getWinner());
    }

    @Test
    public void startingMancalaReturnsThePlayerData() {
        var response = startMancala("Mario", "Luigi");
        var entity = (Mancala)response.getEntity();
        var players = entity.getPlayers();
        assertEquals(2, players.length);
        assertEquals("Mario", players[0].getName());
        assertEquals("Luigi", players[1].getName());
    }

    @Test
    public void startingMancalaReturnsThePits() {
        var response = startMancala("Mario", "Luigi");
        var entity = (Mancala)response.getEntity();
        var players = entity.getPlayers();
        assertEquals(7, players[0].getPits().length);
        assertEquals(0, players[0].getPits()[0].getIndex());
        assertEquals(4, players[0].getPits()[0].getNrOfStones());
        assertEquals(0, players[0].getPits()[6].getNrOfStones());
        assertEquals(7, players[1].getPits().length);
        assertEquals(7, players[1].getPits()[0].getIndex());
        assertEquals(4, players[1].getPits()[0].getNrOfStones());
        assertEquals(0, players[1].getPits()[6].getNrOfStones());
    }

    @Test
    public void startingMancalaStartsANewSession() {
        startMancala("Mario", "Luigi");
        verify(request).getSession(true);
    }

    @Test
    public void startingMancalaSavesTheNewGameInASession() {
        startMancala("Mario", "Luigi");
        verify(session).setAttribute(eq("mancala"), any(MancalaImpl.class));
    }

    @Test
    public void startingMancalaSavesTheNamesInASession() {
        startMancala("Mario", "Luigi");
        verify(session).setAttribute("player1", "Mario");
        verify(session).setAttribute("player2", "Luigi");
    }

    private Response startMancala(String namePlayer1, String namePlayer2) {
        var servlet = new StartMancala();
        var request = createRequestContext();
        var input = playerInput(namePlayer1, namePlayer2);
        return servlet.initialize(request, input);
    }

    private HttpServletRequest createRequestContext() {
        request = mock(HttpServletRequest.class);
        session = mock(HttpSession.class);
        when(request.getSession(true)).thenReturn(session);
        return request;
    }

    private HttpServletRequest request;
    private HttpSession session;

    private PlayerInput playerInput(String namePlayer1, String namePlayer2) {
        var input = new PlayerInput();
        input.setNameplayer1(namePlayer1);
        input.setNameplayer2(namePlayer2);
        return input;
    }
}