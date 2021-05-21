/*
 * This Java source file was generated by the Gradle 'init' task.
 */
package eldorado.domain;

import java.util.Map;
import java.util.HashMap;

public class MapConfiguration {
	public final Map<String, Field> fields;
	
	public MapConfiguration (int mapConfigurationId) {
		this.fields = createMapFromMapConfiguration(mapConfigurations[mapConfigurationId]);
	}
	
	private static Map<String, Field> createMapFromMapConfiguration (String[][] mapConfiguration) {
		Map<String, Field> fields = new HashMap<String, Field>();
		for (String[] fieldConfiguration : mapConfiguration) {
			String coordinatesStringKey = fieldConfiguration[0];
			String fieldValuesString = fieldConfiguration[1];
			fields.put(coordinatesStringKey, createFieldFromFieldValuesString(fieldValuesString));
		}
		return fields;
	}
	
	private static Field createFieldFromFieldValuesString (String fieldValuesString) {
		int startingPointForPawnId = Integer.parseInt(fieldValuesString);
		return new Field(startingPointForPawnId);
	}
	
	public Field getField (int x, int y, int z) {
		return this.fields.get(xyzToKeyString(x, y, z));
	}
	
	private static String xyzToKeyString (Integer x, Integer y, Integer z) {
		return String.join(MapConfiguration.seperator, x.toString(), y.toString(), z.toString());
	}
	
	public static final String seperator = ",";

	private static final String[][][] mapConfigurations = {
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
};