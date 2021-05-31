
import type { GameStateDTO, MapStateDTO, FieldDTO } from "../GameState/GameStateDTO";

export class GameState {
	mapState: MapState;
	winningPawnId: number;
	
	constructor (gameStateDTO: GameStateDTO) {
		this.mapState = new MapState (gameStateDTO.mapStateDTO);
		this.winningPawnId = gameStateDTO.winningPawnId;
	}
		
	get winner () {
		return this.winningPawnId > 0 ? this.winningPawnId : null;
	}
}

export class MapState {
	fields: {[index:string]:Field};
	separator: string;
	
	constructor (mapStateDTO: MapStateDTO) {
		this.separator = mapStateDTO.separator;
		this.fields = this.createFieldsArray (mapStateDTO.fieldDTOs);
	}
	
	createFieldsArray (fieldDTOs: FieldDTO[]) {
		const fieldsArray: {[index:string]:Field} = {};
		for (let i=0; i < fieldDTOs.length; i++) {
			const fieldDTO = fieldDTOs[i];
			const field = new Field(fieldDTO.x, fieldDTO.y, fieldDTO.z, this.separator, fieldDTO.occupiedByPawnId, fieldDTO.type);
			fieldsArray[field.coordinates.xyzStringKey] = field;
		}
		return fieldsArray;
	}
}

export class Field {
	occupiedByPawnId: number;
	coordinates: Coordinates;
	type: string;
	
	constructor (x: number, y: number, z: number, separator: string, occupiedByPawnId: number, type: string) {
		this.occupiedByPawnId = occupiedByPawnId;
		this.coordinates = new Coordinates (x, y, z, separator);
		this.type = type;
	}
}

export class Coordinates {
	x: number;
	y: number;
	z: number;
	separator: string;
	
	constructor (x: number, y: number, z: number, separator: string) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.separator = separator;
	}
	
	get rowColumnStringKey () {
		return `${this.rowId}${this.separator}${this.columnId}`;
	}
	
	get xyzStringKey () {
		return `${this.x}${this.separator}${this.y}${this.separator}${this.z}`;
	}
	
	get rowId () {
		return this.x;
	}
	
	get columnId () {
		return this.y + this.z;
	}
}