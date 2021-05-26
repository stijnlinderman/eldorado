/*
 * This Java source file was generated by the Gradle 'init' task.
 */
package eldorado.api.dto;
import eldorado.domain.*;

public class FieldDTO extends Field {
	public final int x;
	public final int y;
	public final int z;
	
	public FieldDTO (Field field, String xyzStringKey) {
		super (field.occupiedByPawnId, field.isFinishField);
		String[] coordinates = xyzStringKey.split(MapConfiguration.seperator);
		this.x = Integer.parseInt(coordinates[0]);
		this.y = Integer.parseInt(coordinates[1]);
		this.z = Integer.parseInt(coordinates[2]);
	}
}