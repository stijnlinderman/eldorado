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

const pawnIdClasses = [ "", "pawnOne" ];

const alerts = {
	fieldNotFound: "Could not find the field you're looking for.'",
}

export function ShowGame({ gameState, setGameState }: GameProps) {
	const displayableMap = new DisplayableMap (gameState.mapState, setGameState);
	return <div>{displayableMap.getMapForDisplay()}</div>
}

class DisplayableMap {
	rowIds: number[];
	columnIds: number[];
	fields: Field[][] = [[]];
	firstRowStartsOffset: boolean;
	separator: string;
	setGameState: (newGameState: GameState) => void;
	
	constructor (mapState: MapState, setGameState: (newGameState: GameState) => void) {
		let firstRowId: number = 0;
		let lastRowId: number = 0;
		let firstColumnId: number = 0;
		let lastColumnId: number = 0;
		let initialized: boolean = false;
		this.setGameState = setGameState;
		
		Object.values(mapState.fields).map((field) => {
			const rowId = field.coordinates.rowId;
			const columnId = field.coordinates.columnId;
			
			this.addField(field, rowId, columnId);
			
			if (!initialized) {
				firstRowId = rowId;
				lastRowId = rowId;
				firstColumnId = columnId;
				lastColumnId = columnId;
				initialized = true;
			} else {
				firstRowId = (rowId < firstRowId) ? rowId : firstRowId;
				lastRowId = (rowId > lastRowId) ? rowId : lastRowId;
				firstColumnId = (columnId < firstColumnId) ? columnId : firstColumnId;
				lastColumnId = (columnId > lastColumnId) ? columnId : lastColumnId;
			}
		})
		
		this.rowIds = this.createSortedArrayOfIds(firstRowId, lastRowId);
		this.columnIds = this.createSortedArrayOfIds(firstColumnId, lastColumnId);
		this.firstRowStartsOffset = this.determineIfFirstRowShouldStartOffset();
		this.separator = mapState.separator;
	}
	
	addField (field: Field, rowId: number, columnId: number) {
		console.log("adding field for row "+rowId+" and column "+columnId)
		if (this.fields[rowId] == null) {
			console.log("created row "+rowId)
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
/*
		this.rowIds.map((rowId: number, rowIdIndex: number) => {
			const rowOfFields = this.getRowOfFields(rowId);
			const rowOfDiagonals = this.getRowOfDiagonals(rowId);
			return (
				{rowOfFields}
				{rowOfDiagonals}
			)
		})

	}
*/
	getRowOfFields (rowId: number) {
		return <tr key={`${prefix.row_fields}${this.separator}${rowId}`} className="tableRow">
			{this.isOffsetRow(rowId) ? this.offsetCell(rowId) : null}
			{this.columnIds.map((columnId: number) => {
				const key_fieldCell = `${prefix.cell_field}${this.separator}${rowId}${this.separator}${columnId}`;
				const classes_fieldCell = `cell fieldCell buttonCell`;
				const content_fieldCell = (this.fields[rowId][columnId]) ? this.getButton(rowId, columnId): null;
				return <td key={key_fieldCell} className={classes_fieldCell} colSpan={2}>{content_fieldCell}</td>
			})}
		</tr>
	}
	
	isOffsetRow (rowId: number) {
		return !(rowId % 2 == 0);
	}
	
	offsetCell(rowId: number) {
		return <td key={`${prefix.cell_offset}${this.separator}${rowId}`} colSpan={1}/>
	}
	
	getButton (rowId: number, columnId: number) {
		const field = this.fields[rowId][columnId];
		console.log("creating field in row "+rowId+" and column "+columnId)
		const id_button = `${prefix.field_button}${this.separator}${rowId}${this.separator}${columnId}`;
		const classes_button = `fieldButton ${pawnIdClasses[field.occupiedByPawnId]} ${field.isFinishField ? "fieldButtonFinish" : ""}`
		const content_button = this.getButtonContentForField(field);
		return <button className={classes_button} id={id_button} onClick={(event) => this.fieldButtonClicked(event)}>{content_button}</button>;
	}
	
	getButtonContentForField (field: Field) {
		return field.occupiedByPawnId > 0 ? "\u2659" : "";
	}
	
	getRowOfDiagonals(rowId: number) {
		let upwards = true;
		return (<tr key={`${prefix.row_diagonals}${this.separator}${rowId}`} className="tableRow">{
			this.columnIds.concat(this.columnIds).map((columnId: number) => {
				const rowKey = `${prefix.cell_diagonal}${this.separator}${rowId}${this.separator}${columnId}`;
				const rowClasses = `cell fieldCell diagonalCell ${(upwards) ? "diagonalUp" : "diagonalDown"}`;
				upwards = !upwards;				
				return <td key={rowKey} className={rowClasses}></td>;
			})
		}</tr>)
	}
	
	async fieldButtonClicked (event: any) {
		const id_button = event.target.id;
		const rowAndColumnIds = id_button.replace(`${prefix.field_button}${this.separator}`, "").split(this.separator);
		const rowId = rowAndColumnIds[0];
		const columnId = rowAndColumnIds[1];
		console.log("looking for field on row "+rowId+" column "+columnId);
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
		console.log(requestDTO)
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

/*

export function ShowGame({ gameState, setGameState }: GameProps) {
	const amountOfDiagonalsPerRow = gameState.mapBoundaries.lastColumnId - gameState.mapBoundaries.firstColumnId + 1;
	const separator = gameState.mapState.separator;
	const boundaries = new MapBoundaries(this.mapState.fields);

	console.log(boundaries)
	
	return (
		<table className="mapTable"><tbody>
			{createRowOfDiagonals(0, amountOfDiagonalsPerRow, !gameState.mapBoundaries.firstRowStartsOffset)}
			{createRowsOfFields(gameState).map((row) => row)}
		</tbody></table>
	)
	
	function createRowOfDiagonals(rowId: number, length: number, startUpwards: boolean) {
		let diagonals = [];
		let upwards = startUpwards;
		for (let i=0; i <= length; i++) {
			const rowKey = `${prefix.cell_diagonal}${separator}${rowId}${separator}${i}`;
			const rowClasses = `cell fieldCell diagonalCell ${(upwards) ? "diagonalUp" : "diagonalDown"}`;
			diagonals.push(<td key={rowKey} className={rowClasses}></td>);
			upwards = !upwards;
		}
		return <tr key={`${prefix.row_diagonals}${separator}${rowId}`} className="tableRow">{diagonals}</tr>;
	}
	
	function createRowsOfFields (gameState: GameState) {
		const rowsOfFields = []
		for (let rowId = boundaries.firstRowId; rowId <= boundaries.lastRowId; rowId++) {
			console.log("creating row "+rowId)
			rowsOfFields.push(createRowOfFields(rowId, gameState))
			rowsOfFields.push(createRowOfDiagonals(rowId+1, amountOfDiagonalsPerRow, shouldRowBottomDiagonalsStartUpwards(rowId)))
		}
		return rowsOfFields;
	}
	
	function createRowOfFields (rowId: number, gameState: GameState) {
		return <tr key={`${prefix.row_fields}${separator}${rowId}`} className="tableRow">
			{isOffsetRow(rowId) ? <td key={`${prefix.cell_offset}${separator}${rowId}`}/> : null}
			{getFieldsRow(rowId, gameState)}
		</tr>
	}
	
	function isOffsetRow (rowId: number) {
		return ((rowId % 2 == 0) == gameState.mapBoundaries.firstRowStartsOffset)
	}
	
	function getFieldsRow(rowId: number, gameState: GameState) {
		const buttons = []
		for (let columnId = boundaries.firstColumnId; columnId <= boundaries.lastColumnId; columnId++) {
			console.log("going through row "+rowId+" column "+columnId)
			if (shouldColumnInRowBeDrawn(columnId, rowId)) {
				buttons.push(getButtonForTableCell(rowId, columnId));
			}
		}
		return <>
			{buttons.map((button, buttonIndexInRow) => getFieldForButton(button, rowId, buttonIndexInRow))}
		</>
	}
	
	function getFieldForButton (button: any, rowId: number, buttonIndexInRow: number) {
		const buttonKey = `${prefix.cell_field}${separator}${rowId}${separator}${buttonIndexInRow}`;
		const buttonClasses = `cell fieldCell buttonCell${(buttonIndexInRow==0) ? " leftBorder" : ""}`;
		return <td key={buttonKey} className={buttonClasses} colSpan={2}>{button}</td>
	}
	
	function shouldColumnInRowBeDrawn (columnId: number, rowId: number) {
		let offset = isOffsetRow(rowId) ? 1 : 0;
		console.log("column "+columnId+" offset "+offset+" result is "+(columnId % 2 == offset))
		return (Math.abs(columnId) % 2 == offset)
	}
	
	function shouldRowBottomDiagonalsStartUpwards(rowId: number) {
		return (rowId % 2 == 0)
	}
	
	function getButtonForTableCell (rowId: number, columnId: number) {
		console.log("trying to create field in row "+rowId+" and column "+columnId)
		const field = gameState.getFieldByRowAndColumnIdsStringKey(rowId, columnId);
		console.log(field)
		if (field) {
			console.log("creating field in row "+rowId+" (actually "+field.coordinates.rowId+") and column "+columnId+" (actually "+field.coordinates.columnId+")")
			const buttonId = `${prefix.field_button}${separator}${field.coordinates.key}`;
			const finishFieldClass = field.isFinishField ? "fieldButtonFinish" : "";
			const buttonClasses = `fieldButton ${getPawnIdClass(field.occupiedByPawnId)} ${finishFieldClass}`
			const buttonContent = getButtonContentForField(field);
			return <button className={buttonClasses} id={buttonId} onClick={(event) => fieldButtonClicked(event)}>{buttonContent}</button>;
		} else {
			return null;
		}
	}
	
	function getPawnIdClass (pawnId: number) {
		return pawnIdClasses[pawnId];
	}
	
	function getButtonContentForField (field: Field) {
		return field.occupiedByPawnId > 0 ? "\u2659" : `${field.coordinates.x}${field.coordinates.y}${field.coordinates.z}`;
	}
	
	async function fieldButtonClicked (event: any) {
		const buttonNode = event.target;
		const rowAndColumIdsStringKey = buttonNode.id.replace(`${prefix.field_button}${gameState.mapState.separator}`, "");
		const rowAndColumnIds = rowAndColumIdsStringKey.split(separator);
		const rowId = rowAndColumnIds[0];
		const columnId = rowAndColumnIds[1];
		const field = gameState.getFieldByRowAndColumnIdsStringKey(rowId, columnId);
		if (field) {
			movePawnToField(field);
		} else {
			alert(alerts.fieldNotFound)
		}
	}
	
	async function movePawnToField (field: Field) {
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
				setGameState(gameState);
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

export class DisplayableMap {
	firstRowId: number = 0;
	lastRowId: number = 0;
	firstColumnId: number = 0;
	lastColumnId: number = 0;
	firstRowStartsOffset = false;
	fields
	
	constructor (fields: {[index:string]:Field}) {
		let initiated = false;
		Object.values(fields).map((field) => {
			const rowId = field.coordinates.rowId;
			const columnId = field.coordinates.columnId;
			console.log("processing boundary row "+rowId+" column "+columnId)
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
		this.firstRowStartsOffset = Math.abs(this.firstColumnId) % 2 != 0;
		console.log("First row starts offset is "+this.firstRowStartsOffset);
	}
}

*/