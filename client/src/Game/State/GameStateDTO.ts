
export interface GameStateDTO {
	mapStateDTO: MapStateDTO;
	winningPawnId: number; 
	deckStateDTO: DeckStateDTO;
}

export interface MapStateDTO {
	fieldDTOs: FieldDTO[];
	separator: string;
}

export interface FieldDTO {
	x: number;
	y: number;
	z: number;
	occupiedByPawnId: number;
	type: string;
}

export interface DeckStateDTO {
	deckAmountLeft: number;
	hand: string[];
	discardedAmount: number;
}