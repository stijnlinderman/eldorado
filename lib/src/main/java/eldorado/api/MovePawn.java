/*
 * This Java source file was generated by the Gradle 'init' task.
 */
package eldorado.api;

import jakarta.servlet.http.*;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;

import eldorado.domain.*;

@Path("/movepawn")
public class MovePawn {
    @POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response initialize(
			@Context HttpServletRequest request,
			String xyzStringKey) {
    	
    	try {
    		HttpSession session = request.getSession(true);
    		Game game = (Game) session.getAttribute("game");
    		
    		return Response.status(200).entity(game.getCurrentStateDTO()).build();
    	} catch (Exception e) {
    		return Response.status(500).build();
    	}
	}
}
