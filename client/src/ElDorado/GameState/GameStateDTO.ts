
export interface GameStateDTO {
	mapStateDTO: MapStateDTO;
	winningPawnId: number; 
}

export interface MapStateDTO {
	fieldDTOs: FieldDTO[];
	separator: string;
	fieldTypes: [];
}

export interface FieldDTO {
	x: number;
	y: number;
	z: number;
	occupiedByPawnId: number;
	type: string;
}