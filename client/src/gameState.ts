
const strSep = ","

export interface GameState {
	fields_asArray: string[];
	fields: {[index:string]:Field};
	rows: {[index:number]:{[index:number]:Field}};
	mapSize: {
		rowMin: number,
		rowMax: number,
		colMin: number,
		colMax: number
	}
}

export function configureFields (gameState: GameState) {
	gameState.fields = {};
	gameState.rows = [];
	gameState.mapSize = {};
	const amountToConfigure = gameState.fields_asArray.length;
	
	for (let fieldIndex = 0; fieldIndex < amountToConfigure; fieldIndex++) {
		const fieldString = gameState.fields_asArray[fieldIndex];
		const field = createFieldFromFieldString(fieldString);
		addFieldToGameStateFields_byXYZKey(field)
		addFieldToGameStateRows_byColId (field)
		
		updateMapSize (field.rowId, field.colId)
		
		if (fieldIndex == 0) {
			setMapSize(field.rowId, field.colId);
		} else {
			updateMapSize(field.rowId, field.colId)
		}
	}
	
	function createFieldFromFieldString (fieldString: string) {
		const fieldStringValues = fieldString.split(strSep);
		const x = parseInt(fieldStringValues[0]);
		const y = parseInt(fieldStringValues[1]);
		const z = parseInt(fieldStringValues[2]);
		const field = new Field(x, y, z);
		return field;
	}
	
	function addFieldToGameStateFields_byXYZKey(field: Field) {
		gameState.fields[composePosKey(field.x, field.y, field.z)] = field;
	}
	
	function addFieldToGameStateRows_byColId (field: Field) {		
		if (typeof gameState.rows[field.rowId] === 'undefined') {
			gameState.rows[field.rowId] = [];
		}
		gameState.rows[field.rowId][field.colId] = field;		
	}
	
	function setMapSize (rowId: number, colId: number) {
		gameState.mapSize.rowMin = rowId;
		gameState.mapSize.rowMax = rowId;
		gameState.mapSize.colMin = colId;
		gameState.mapSize.colMax = colId;
	}
	
	function updateMapSize(rowId: number, colId: number) {
		if (rowId < gameState.mapSize.rowMin) {
			gameState.mapSize.rowMin = rowId;
		} else if (rowId > gameState.mapSize.rowMax) {
			gameState.mapSize.rowMax = rowId;
		}
		if (colId < gameState.mapSize.colMin) {
			gameState.mapSize.colMin = colId;
		} else if (colId > gameState.mapSize.colMax) {
			gameState.mapSize.colMax = colId;
		}
	}
}

export class Field {
	x: number;
	y: number;
	z: number;
	rowId: number;
	colId: number;
	
	constructor (x:number, y:number, z:number) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.rowId = x;
		this.colId = y + z;
	}
	
	getPosKey () {
		return composePosKey(this.x, this.y, this.z);
	}
}
	
function composePosKey (x:number, y:number, z:number) {
	return [x,y,z].join(strSep);
}