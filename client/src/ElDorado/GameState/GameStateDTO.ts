
export interface GameStateDTO {
	mapStateDTO: MapStateDTO;
}

export interface MapStateDTO {
	fieldDTOs: FieldDTO[];
	seperator: string;
}

export interface FieldDTO {
	coordinatesDTO: CoordinatesDTO;
	fieldStateDTO: FieldStateDTO;
}

export interface CoordinatesDTO {
	x: number;
	y: number;
	z: number;	
}

export interface FieldStateDTO {
	occupiedByPawnId: number;
}