import type { Field } from "../GameState/GameState";
import { GameState, MapState } from "../GameState/GameState";
import type { GameStateDTO } from "../GameState/GameStateDTO";
import React from "react";
import "./ShowGame.css";

type GameProps = {
    gameState: GameState,
	setGameState(newGameState: GameState): void
}

const prefix = {
	row_diagonals: "row_diagonals",
	row_fields: "row_fields",
	cell_offset: "cell_offset",
	cell_diagonal: "cell_diagonal",
	cell_field: "cell_field",
	field_button: "field_button"
}

const pawnIdClasses = [ "unoccupiedField", "pawnOne" ];

const alerts = {
	fieldNotFound: "Could not find the field you're looking for.'",
}

const showCoordinatesOnButtons_forDebug = false;

export function ShowGame({ gameState, setGameState }: GameProps) {
	const displayableMap = new DisplayableMap (gameState.mapState, setGameState);
	return <div className="mapContainer">{displayableMap.getMapForDisplay()}</div>
}

class DisplayableMap {
	rowIds: number[];
	columnIds: number[];
	fields: Field[][] = [[]];
	firstRowStartsOffset: boolean;
	separator: string;
	setGameState: (newGameState: GameState) => void;
	
	constructor (mapState: MapState, setGameState: (newGameState: GameState) => void) {
		let mapBoundaries: MapBoundaries;
		this.setGameState = setGameState;
		
		Object.values(mapState.fields).map((field) => {
			const rowId = field.coordinates.rowId;
			const columnId = field.coordinates.columnId;
			
			this.addField(field, rowId, columnId);
			
			if (typeof mapBoundaries === 'undefined') {
				mapBoundaries = new MapBoundaries(rowId, columnId);
			} else {
				mapBoundaries.update(rowId, columnId)
			}
		})
		
		this.rowIds = this.createSortedArrayOfIds(mapBoundaries!.firstRowId, mapBoundaries!.lastRowId);
		this.columnIds = this.createSortedArrayOfIds(mapBoundaries!.firstColumnId, mapBoundaries!.lastColumnId);
		this.firstRowStartsOffset = this.determineIfFirstRowShouldStartOffset();
		this.separator = mapState.separator;
	}
	
	addField (field: Field, rowId: number, columnId: number) {
		if (this.fields[rowId] == null) {
			this.fields[rowId] = [];
		} 
		this.fields[rowId][columnId] = field;
	}
	
	createSortedArrayOfIds (firstId: number, lastId: number) {
		const array = [];
		for (let id = firstId; id <= lastId; id ++) {
			array.push(id);
		}
		array.sort
		return array;
	}
	
	determineIfFirstRowShouldStartOffset () {
		return false;
	}
	
	getMapForDisplay () {
		return (
			<table className="mapTable"><tbody>
				{this.getRowsForDisplay()}
			</tbody></table>
		)
	}
	
	getRowsForDisplay() {
		const rows: any = [];
		rows.push(this.getRowOfDiagonals(this.rowIds[0]-1))	
		this.rowIds.map((rowId: number) => {
			rows.push(this.getRowOfFields(rowId))
			rows.push(this.getRowOfDiagonals(rowId))			
		})
		return rows;
	}

	getRowOfFields (rowId: number) {
		return <tr key={`${prefix.row_fields}${this.separator}${rowId}`} className="tableRow">
			{this.isOffsetRow(rowId) ? <td key={`${prefix.cell_offset}${this.separator}${rowId}`} colSpan={1}/> : null}
			{this.columnIds.map((columnId: number) => {
				if (this.shouldColumnBeDrawnInRow(columnId, rowId)) {
					const rowColumnStringKey_fieldCell = `${prefix.cell_field}${this.separator}${rowId}${this.separator}${columnId}`;
					const classes_fieldCell = `cell fieldCell buttonCell ${(columnId <= this.columnIds[1]) ? "leftBorder" : ""}`;
					const content_fieldCell = (this.fields[rowId][columnId]) ? this.getButton(rowId, columnId): null;
					return <td key={rowColumnStringKey_fieldCell} className={classes_fieldCell} colSpan={2}>{content_fieldCell}</td>
				}
			})}
		</tr>
	}
	
	isOffsetRow (rowId: number) {
		return !(rowId % 2 == 0);
	}
	
	shouldColumnBeDrawnInRow (columnId: number, rowId: number) {
		if (this.isOffsetRow(rowId) && (columnId+1) % 2 == 0) {
			return true;
		} else if (!this.isOffsetRow(rowId) && (columnId) % 2 == 0) {
			return true;
		} else {
			return false;
		}
	}
	
	getButton (rowId: number, columnId: number) {
		const field = this.fields[rowId][columnId];
		const id_button = `${prefix.field_button}${this.separator}${field.coordinates.rowColumnStringKey}`;
		const classes_button = `fieldButton ${pawnIdClasses[field.occupiedByPawnId]} ${field.type.replace("-","")}`
		const content_button = this.getButtonContentForField(field);
		return <button className={classes_button} id={id_button} onClick={(event) => this.fieldButtonClicked(event)}>{content_button}</button>;
	}
	
	getButtonContentForField (field: Field) {
		return field.occupiedByPawnId > 0 ? "\u2659" : showCoordinatesOnButtons_forDebug ? field.coordinates.xyzStringKey : "";
	}
	
	getRowOfDiagonals(rowId: number) {
		let upwards = this.isOffsetRow(rowId);
		const diagonals: any = [];
		this.columnIds.map((columnId: number) => {
			diagonals.push(this.getDiagonal(rowId-1, columnId, upwards));
			upwards = !upwards;
			if (this.isEndOfRow(columnId)) {
				diagonals.push(this.getDiagonal(rowId, columnId, upwards));
			}
		})
		return (<tr key={`${prefix.row_diagonals}${this.separator}${rowId}`} className="tableRow">
			{diagonals}
		</tr>)
	}
	
	getDiagonal (rowId: number, columnId: number, upwards: boolean) {
		const rowKey = `${prefix.cell_diagonal}${this.separator}${rowId}${this.separator}${columnId}`;
		const rowClasses = `cell fieldCell diagonalCell ${(upwards) ? "diagonalUp" : "diagonalDown"}`;
		upwards = !upwards;			
		return <td key={rowKey} className={rowClasses}></td>;		
	}
	
	isEndOfRow (columnId: number) {
		if (columnId == this.columnIds[this.columnIds.length-1]) {
			return true
		} else {
			return false
		}
	}
	
	async fieldButtonClicked (event: any) {
		const id_button = event.target.id;
		const rowAndColumnIds = id_button.replace(`${prefix.field_button}${this.separator}`, "").split(this.separator);
		const field = this.fields[rowAndColumnIds[0]][rowAndColumnIds[1]];		
		if (field) {
			this.movePawnToField(field);
		} else {
			alert(alerts.fieldNotFound)
		}
	}
	
	async movePawnToField (field: Field) {
		const pawnId = 1;
		const requestDTO: MovePawnRequestDTO = new MovePawnRequestDTO (pawnId, field.coordinates.x, field.coordinates.y, field.coordinates.z);
		try {
			const request = {
				method: "POST",
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json"
				},
				body: JSON.stringify(requestDTO)
			}
	
			const response = await fetch("eldorado/api/movepawn", request);
			
	        if (response.status == 200) {
	            const gameStateDTO: GameStateDTO = await response.json();
				const gameState = new GameState(gameStateDTO);
				this.setGameState(gameState);
	        } else if (response.status == 202) {
				const deniedRequestDTO: DeniedRequestDTO = await response.json();
				alert(deniedRequestDTO.message);
	        } else {
				console.error(response.statusText)
			}
	
	    } catch (error) {
	        console.error(error.toString())
	    }
	}
}

class MapBoundaries {
	firstRowId: number;
	lastRowId: number;
	firstColumnId: number;
	lastColumnId: number;
	
	constructor (rowId: number, columnId: number) {
		this.firstRowId = rowId;
		this.lastRowId = rowId;
		this.firstColumnId = columnId;
		this.lastColumnId = columnId;
	}
	
	update (rowId: number, columnId: number) {
		this.firstRowId = (rowId < this.firstRowId) ? rowId : this.firstRowId;
		this.lastRowId = (rowId > this.lastRowId) ? rowId : this.lastRowId;
		this.firstColumnId = (columnId < this.firstColumnId) ? columnId : this.firstColumnId;
		this.lastColumnId = (columnId > this.lastColumnId) ? columnId : this.lastColumnId;
	}
}

class MovePawnRequestDTO {
	pawnId: number;
	x: number;
	y: number;
	z: number;
	
	constructor (pawnId: number, x: number, y: number, z: number) {
		this.pawnId = pawnId;
		this.x = x;
		this.y = y;
		this.z = z;
	}
}

class DeniedRequestDTO {
	message: string;
	
	constructor (message: string) {
		this.message = message;
	}
}