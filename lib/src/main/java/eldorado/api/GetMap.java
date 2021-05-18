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

@Path("/getmap")
public class GetMap {
    @GET
	//@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response initialize(
			@Context HttpServletRequest request) {
    	
    	String[] mapConfig = ConfiguredMap.mapConfigs[0];
    	ConfiguredMap map = new ConfiguredMap(mapConfig);
		
        HttpSession session = request.getSession(true);
        session.setAttribute("map", map);
        
        ConfiguredMap.ConfiguredMap_JSONed jsonedMap = map.getJSONed();
		return Response.status(200).entity(jsonedMap).build();
	}
}