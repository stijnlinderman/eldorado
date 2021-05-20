
const strSep = ","

export interface GameState {
	fieldStates: FieldState[];
	fieldsByXYZ: {[index:string]:Field};
	rowsToDisplay: {[index:number]:{[index:number]:Field}};
	firstRowId: number;
	lastRowId: number;
	firstColId: number;
	lastColId: number;
}

export interface FieldState {
	pos: Pos;
	field: Field;
}

export interface Field {
	pawnId: number;
	pos: Pos;
}

export interface Pos {
	x: number;
	y: number;
	z: number;
	key: string;
	rowId: number;
	colId: number;
}

export function processGameState (gameState: GameState) {
	gameState.fieldsByXYZ = {};
	gameState.rowsToDisplay = [];
		
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
	
	function updateMapSize(rowId: number, colId: number) {
		if (rowId < gameState.firstRowId) {
			gameState.firstRowId = rowId;
		} else if (rowId > gameState.lastRowId) {
			gameState.lastRowId = rowId;
		}
		if (colId < gameState.firstColId) {
			gameState.firstColId = colId;
		} else if (colId > gameState.lastColId) {
			gameState.lastColId = colId;
		}
	}
}