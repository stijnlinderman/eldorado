
import type { GameStateDTO, MapStateDTO, FieldDTO } from "../GameState/GameStateDTO";

export class GameState {
	mapState: MapState;
	mapBoundaries: MapBoundaries;
	
	constructor (gameStateDTO: GameStateDTO) {
		this.mapState = new MapState (gameStateDTO.mapStateDTO);
		this.mapBoundaries = new MapBoundaries(this.mapState.fields);
	}
	
	getFieldByRowAndColumnIds(rowId: number, columnId: number) {
		const xyzStringKey = this.getXYZStringKeyFromRowAndFieldIds(rowId, columnId);
		return this.getFieldByXYZStringKey(xyzStringKey);
	}
	
	getFieldByXYZStringKey(xyzStringKey: string) {
		return this.mapState.fields[xyzStringKey];
	}
	
	getXYZStringKeyFromRowAndFieldIds (rowId: number, columnId: number) {
		const rowId_accomodatedForBoundaries = rowId + this.mapBoundaries.firstRowId;
		const columnId_accomodatedForBoundaries = columnId + this.mapBoundaries.firstColumnId;
		const x = rowId_accomodatedForBoundaries;
		const z = (columnId_accomodatedForBoundaries + x) / 2;
		const y = z - x;
		return `${x}${this.mapState.seperator}${y}${this.mapState.seperator}${z}`;
	}
}

export class MapState {
	fields: {[index:string]:Field};
	seperator: String;
	
	constructor (mapStateDTO: MapStateDTO) {
		this.seperator = mapStateDTO.seperator;
		this.fields = this.createFieldsArrayXYZStringMapped (mapStateDTO.fieldDTOs, mapStateDTO.seperator);
	}
	
	createFieldsArrayXYZStringMapped (fieldDTOs: FieldDTO[], seperator: string) {
		const fieldsArray: {[index:string]:Field} = {};
		for (let i=0; i < fieldDTOs.length; i++) {
			const fieldDTO = fieldDTOs[i];
			const coordinates = new Coordinates(fieldDTO.x, fieldDTO.y, fieldDTO.z, seperator)
			fieldsArray[coordinates.key] = new Field(coordinates, fieldDTO.occupiedByPawnId, fieldDTO.isWinningField);
		}
		return fieldsArray;
	}
}

export class MapBoundaries {
	firstRowId: number = 0;
	lastRowId: number = 0;
	firstColumnId: number = 0;
	lastColumnId: number = 0;
	
	constructor (fields: {[index:string]:Field}) {
		let initiated = false;
		Object.values(fields).map((field) => {
			const rowId = field.coordinates.rowId;
			const columnId = field.coordinates.columnId;
			if (!initiated) {
				this.firstRowId = rowId;
				this.lastRowId = rowId;
				this.firstColumnId = columnId;
				this.lastColumnId = columnId;
				initiated = true;
			} else {
				this.firstRowId = (rowId < this.firstRowId) ? rowId : this.firstRowId;
				this.lastRowId = (rowId > this.lastRowId) ? rowId : this.lastRowId;
				this.firstColumnId = (columnId < this.firstColumnId) ? columnId : this.firstColumnId;
				this.lastColumnId = (columnId > this.lastColumnId) ? columnId : this.lastColumnId;
			}
		});
	}
}

export class Field {
	occupiedByPawnId: number;
	coordinates: Coordinates;
	isWinningField: boolean;
	
	constructor (coordinates: Coordinates, occupiedByPawnId: number, isWinningField: boolean) {
		this.occupiedByPawnId = occupiedByPawnId;
		this.coordinates = coordinates;
		this.isWinningField = isWinningField;
	}
	
	get buttonContent () {
		return (this.occupiedByPawnId > 0) ? this.occupiedByPawnId : "";
	}
}

export class Coordinates {
	x: number;
	y: number;
	z: number;
	seperator: string;
	
	constructor (x: number, y: number, z: number, seperator: string) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.seperator = seperator;
	}
	
	get key () {
		return this.x + this.seperator + this.y + this.seperator + this.z;
	}
	
	get rowId () {
		return this.x;
	}
	
	get columnId () {
		return this.y + this.z;
	}
}