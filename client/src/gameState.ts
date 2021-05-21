
interface GameStateDTO {
	mapStateDTO: MapStateDTO;
}

interface MapStateDTO {
	fieldDTOs: FieldDTO[];
	seperator: string;
}

interface FieldDTO {
	coordinatesDTO: CoordinatesDTO;
	fieldStateDTO: FieldStateDTO;
}

interface CoordinatesDTO {
	x: number;
	y: number;
	z: number;	
}

interface FieldStateDTO {
	occupiedByPawnId: number;
}

class GameState {
	mapState: MapState;
	
	constructor (gameStateDTO: GameStateDTO) {
		this.mapState = new MapState (gameStateDTO.mapStateDTO);
	}
}

class MapState {
	fields: {[index:string]:Field} = {};
	seperator: String;
	mapBoundaries: MapBoundaries;
	
	constructor (mapStateDTO: MapStateDTO) {
		this.seperator = mapStateDTO.seperator;
		this.createFields_andAdjustMapBoundaries (mapStateDTO.fieldDTOs, mapStateDTO.seperator);
	}
	
	function createFields_andAdjustMapBoundaries (fieldDTOs: FieldDTO[], seperator: string) {
		for (let i=0; i < fieldDTOs.length; i++) {
			const fieldDTO = fieldDTOs[i];
			const coordinates = new Coordinates(fieldDTO.coordinatesDTO, seperator)
			fieldsArrayInProgress[coordinates.key] = new Field(coordinates, fieldDTO.fieldStateDTO);
			this.adjustMapBoundaries (coordinates.rowId, coordinates.columnId);
		}
	};
	
	function adjustMapBoundaries (rowId: number, columnId: number) {
		if (this.mapBoundaries === 'undefined') {
			this.mapBoundaries = new MapBoundaries (rowId, columnId);
		} else {
			this.mapBoundaries.updateBoundaries (rowId, columnId);
		}
	}
}

class MapBoundaries {
	firstRowId: number;
	lastRowId: number;
	firstColumnId: number;
	lastColumnId: number;
	
	constructor (firstRowId: number, lastRowId: number, firstColumnId: number, lastColumnId: number) {
		this.firstRowId = firstRowId;
		this.lastRowId = lastRowId;
		this.firstColumnId = firstColumnId;
		this.lastColumnId = lastColumnId;	}
	
	set updateBoundaries (rowId: number, columnId: number) {
		this.firstRowId = (rowId < this.firstRowId) ? rowId : this.firstRowId;
		this.lastRowId = (rowId < this.lastRowId) ? rowId : this.lastRowId;
		this.firstColumnId = (columnId < this.firstColumnId) ? columnId : this.firstColumnId;
		this.lastColumnId = (columnId < this.lastColumnId) ? columnId : this.lastColumnId;
	}
}

class Field {
	occupiedByPawnId: number;
	coordinates: Coordinates;
	
	constructor (coordinates: Coordinates, fieldStateDTO: FieldStateDTO) {
		this.occupiedByPawnId = fieldStateDTO.occupiedByPawnId;
		this.coordinates = coordinates;
	}
}

class Coordinates {
	x: number;
	y: number;
	z: number;
	seperator: string;
	
	constructor (coordinatesDTO: CoordinatesDTO, seperator: string) {
		this.x = coordinatesDTO.x;
		this.y = coordinatesDTO.y;
		this.z = coordinatesDTO.z;
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

export function processGameStateDTO (gameStateDTO: GameStateDTO): GameState {
	const gameState: GameState = {
		fieldsByXYZ: {},
		rowsToDisplay: [],
	};
		
	for (let fieldStateIndex = 0; fieldStateIndex < gameState.fieldStates.length; fieldStateIndex++) {
		const fieldState = gameState.fieldStates[fieldStateIndex];
		const field = fieldState.field;
		const pos = fieldState.pos;
		processPosForField(field, pos)
		
		addFieldToGameXYZArray(field);
		addFieldToGameRowColumnTable(field);
				
		if (fieldStateIndex == 0) {
			setMapSize(field.pos.rowId, field.pos.colId);
		} else {
			updateMapSize(field.pos.rowId, field.pos.colId)
		}
	}
	
	function processPosForField (field: Field, pos: Pos) {
		pos.key = pos.x + strSep + pos.y + strSep + pos.z;
		pos.rowId = pos.x;
		pos.colId = pos.y + pos.z;
		field.pos = pos;
	}
	
	function addFieldToGameXYZArray (field: Field) {
		gameState.fieldsByXYZ[field.pos.key] = field;
	}
	
	function addFieldToGameRowColumnTable (field: Field) {
		if (typeof gameState.rowsToDisplay[field.pos.rowId] === 'undefined') {
			gameState.rowsToDisplay[field.pos.rowId] = [];
		}
		gameState.rowsToDisplay[field.pos.rowId][field.pos.colId] = field;	
	}
	
	function setMapSize (rowId: number, colId: number) {
		gameState.firstRowId = rowId;
		gameState.lastRowId = rowId;
		gameState.firstColId = colId;
		gameState.lastColId = colId;
	}
	
	return gameState;
}