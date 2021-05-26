
export interface GameStateDTO {
	mapStateDTO: MapStateDTO;
}

export interface MapStateDTO {
	fieldDTOs: FieldDTO[];
	seperator: string;
}

export interface FieldDTO {
	x: number;
	y: number;
	z: number;
	occupiedByPawnId: number;
	isWinningField: boolean;
}