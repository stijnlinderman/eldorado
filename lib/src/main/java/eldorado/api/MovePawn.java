/*
 * This Java source file was generated by the Gradle 'init' task.
 */
package eldorado.api;

import jakarta.servlet.http.*;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;

import eldorado.domain.*;
import eldorado.api.dto.*;

@Path("/movepawn")
public class MovePawn {
    @POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response initialize(
			@Context HttpServletRequest request,
			MovePawnRequestDTO requestDTO) {
    	try {
    		HttpSession session = request.getSession(true);
    		Game game = (Game) session.getAttribute("game");
    		
    		int pawnId = requestDTO.pawnId;
    		int newX = requestDTO.x;
    		int newY = requestDTO.y;
    		int newZ = requestDTO.z;
    		
    		Field originField = game.getMap().findNeighboringFieldThatCurrentlyContainsPawn(newX, newY, newZ, pawnId);
    		Field fieldToMoveTo = game.getMap().getField(newX, newY, newZ);
    		    		
    		if (originField != null && fieldToMoveTo != null) {
    			fieldToMoveTo.receivePawn(originField);
    			game.processPossibleWin(fieldToMoveTo);
        		GameStateDTO gameStateDTO = new GameStateDTO (game);
        		return Response.status(200).entity(gameStateDTO).build();
    		} else {
    			String message = getErrorMessageForMovePawnRequestSituation (originField, fieldToMoveTo);
    			DeniedRequestDTO deniedRequestDTO = new DeniedRequestDTO(message);
        		return Response.status(202).entity(deniedRequestDTO).build();
    		}
    	} catch (Exception e) {
    		return Response.status(500).entity("Exception thrown.").build();
    	}
	}
    
    private static String getErrorMessageForMovePawnRequestSituation (Field originField, Field fieldToMoveTo) {
		String message = "Something went wrong.";
		if (fieldToMoveTo != null && originField == null) {
			message = "It's not possible to move to that field. "
					+ "Please choose a field that is 1 field away from the pawn.";
		} else if (fieldToMoveTo == null && originField != null) {
			message = "Could not find the field that the pawn should move to.";
		}
		return message;
    }
}