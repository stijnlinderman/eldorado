/*
 * This Java source file was generated by the Gradle 'init' task.
 */
package eldorado.api;

import java.io.IOException;

import jakarta.servlet.http.*;
import jakarta.servlet.ServletException;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;

import eldorado.api.*;
import eldorado.domain.*;

@Path("/hello")
public class Hello {
    @GET
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response initialize(
			@Context HttpServletRequest request) {
    	
    	ElDorado elDorado = new ElDorado();
		
        HttpSession session = request.getSession(true);
        session.setAttribute("elDorado", elDorado);

		return Response.status(200).entity(elDorado).build();
	}
}
