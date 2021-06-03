import type { Field } from "../../State/GameState";
import { GameState } from "../../State/GameState";
import type { GameStateDTO } from "../../State/GameStateDTO";
import React from "react";
import "./MapDisplay.css";

const prefix = {
	row_diagonals: "row_diagonals",
	row_fields: "row_fields",
	cell_offset: "cell_offset",
	cell_diagonal: "cell_diagonal",
	cell_field: "cell_field",
	field_button: "field_button"
}

const pawnIdClasses = [ "unoccupiedField", "pawnOne" ];

const showCoordinatesOnButtons_forDebug = false;

type MapDisplayProps = {gameState: GameState, setGameState(newGameState: GameState): void}
type RowOfFieldsProps = {rowId: number}
type FieldCellProps = {rowId: number, columnId: number}
type FieldButtonProps = {rowId: number, columnId: number}
type RowOfDiagonalsProps = {rowId: number}
type DiagonalProps = {rowId: number, columnId: number}

export function MapDisplay({ gameState, setGameState }: MapDisplayProps) {
	const mapState = gameState.mapState;
	const separator = mapState.separator;

	const fields_as2dTable: Field[][] = [[]];
	let mapBoundaries: MapBoundaries;
	organizeFieldsIn2dArray_andUpdateMapBoundaries ()	
	
	function organizeFieldsIn2dArray_andUpdateMapBoundaries () {
		Object.values(mapState.fields).map((field) => {
			const rowId = field.coordinates.rowId;
			const columnId = field.coordinates.columnId;
			
			organizeFieldTo2dFieldsArray(field, rowId, columnId);
			updateMapBoundaries (rowId, columnId);
		})
	
		function organizeFieldTo2dFieldsArray (field: Field, rowId: number, columnId: number) {
			if (fields_as2dTable[rowId] == null) {
				fields_as2dTable[rowId] = [];
			} 
			fields_as2dTable[rowId][columnId] = field;
		}
	
		function updateMapBoundaries (rowId: number, columnId: number) {
			if (typeof mapBoundaries === 'undefined') {
				mapBoundaries = new MapBoundaries(rowId, columnId);
			} else {
				mapBoundaries.update(rowId, columnId)
			}
		}
	}
	
	const rowIds = createSortedArrayOfIds(mapBoundaries!.firstRowId, mapBoundaries!.lastRowId);
	const columnIds = createSortedArrayOfIds(mapBoundaries!.firstColumnId, mapBoundaries!.lastColumnId);
	
	function createSortedArrayOfIds (firstId: number, lastId: number) {
		const array = [];
		for (let id = firstId; id <= lastId; id ++) {
			array.push(id);
		}
		array.sort
		return array;
	}
	
	return (
		<table className="mapTable"><tbody>
			<RowOfDiagonals key={`${prefix.row_diagonals}${separator}${rowIds[0]-1}`} rowId={rowIds[0]-1}/>
			{rowIds.map((rowId: number) => {
				return [
					<RowOfFields key={`${prefix.row_fields}${separator}${rowId}`} rowId={rowId}/>,
					<RowOfDiagonals key={`${prefix.row_diagonals}${separator}${rowId}`}  rowId={rowId}/>
				]	
			})}
		</tbody></table>
	)
	
	function RowOfDiagonals({rowId} : RowOfDiagonalsProps) {
		const lastColumnId = columnIds[columnIds.length-1]+1;
		return (
			<tr className="tableRow">
			{
				columnIds.map((columnId: number) => {
					return (
						<Diagonal key={`${prefix.cell_diagonal}${separator}${rowId}${separator}${columnId}`} rowId={rowId} columnId={columnId}/>
					)
				})
			}		
			<Diagonal key={`${prefix.cell_diagonal}${separator}${rowId}${separator}${lastColumnId}`} rowId={rowId} columnId={lastColumnId}/>
			</tr>
		)
	
		function Diagonal ({rowId, columnId} : DiagonalProps) {
			const rowClasses = `cell fieldCell diagonalCell ${getDiagonalDirectionClassName(rowId, columnId)}`;
			return <td className={rowClasses}></td>;		
		}
		
		function getDiagonalDirectionClassName(rowId: number, columnId: number) {
			const rowId_abs = Math.abs(rowId);
			const columnId_abs = Math.abs(columnId);
			const upwards = (rowId_abs % 2 == 0 && columnId_abs % 2 == 1) || (rowId_abs % 2 == 1 && columnId_abs % 2 == 0)
			return upwards ? "diagonalUp" : "diagonalDown";
		}
	}
	
	function RowOfFields ({rowId} : RowOfFieldsProps) {
		return (
			<tr className="tableRow">
				{isOffsetRow(rowId) ? <td key={`${prefix.cell_offset}${separator}${rowId}`} colSpan={1}/> : null}
				{columnIds.map((columnId: number) => {
					if (shouldColumnBeDrawnInRow(columnId, rowId)) {
						return <FieldCell key={`${prefix.cell_field}${separator}${rowId}${separator}${columnId}`} rowId={rowId} columnId={columnId}/>
					}
				})}
			</tr>
		)	
	
		function isOffsetRow (rowId: number) {
			return !(rowId % 2 == 0);
		}
		
		function shouldColumnBeDrawnInRow (columnId: number, rowId: number) {
			if (isOffsetRow(rowId) && (columnId+1) % 2 == 0) {
				return true;
			} else if (!isOffsetRow(rowId) && (columnId) % 2 == 0) {
				return true;
			} else {
				return false;
			}
		}
		
		function FieldCell ({rowId, columnId} : FieldCellProps) {
			return (
				<td 
					className={`cell fieldCell buttonCell ${(columnId <= columnIds[1]) ? "leftBorder" : ""}`} 
					colSpan={2}>
				<FieldButton rowId={rowId} columnId={columnId}/>
				</td>
			)
		
			function FieldButton ({rowId, columnId} : FieldButtonProps) {
				const field = fields_as2dTable[rowId][columnId];
				if (field) {
					const id_button = `${prefix.field_button}${separator}${field.coordinates.rowColumnStringKey}`;
					const classes_button = `fieldButton ${pawnIdClasses[field.occupiedByPawnId]} ${field.type.replace("-","")}`
					const content_button = field.occupiedByPawnId > 0 ? "\u2659" : showCoordinatesOnButtons_forDebug ? field.coordinates.xyzStringKey : "";
					if (field.isEnabled) {
						return <button className={`${classes_button} enabledButton`} id={id_button} onClick={(event) => fieldButtonClicked(event)}>{content_button}</button>;
					} else {
						return <button className={classes_button} id={id_button} disabled>{content_button}</button>;
					}
				} else {
					return null;
				}
			}
		}
	}
	
	async function fieldButtonClicked (event: any) {
		const id_button = event.target.id;
		const rowAndColumnIds = id_button.replace(`${prefix.field_button}${separator}`, "").split(separator);
		const field = fields_as2dTable[rowAndColumnIds[0]][rowAndColumnIds[1]];	
		
		if (gameState.deckState.areMultipleCardsSelected()) {
			alert("Select only one card to use in your move.");
		} else if (!gameState.deckState.isOneCardSelected()) {
			alert("Select a card first.");
		} else {
			tryMovePawnToField(field);
		}
		async function tryMovePawnToField (field: Field) {
			const pawnId = 1;
			const requestDTO: MovePawnRequestDTO = new MovePawnRequestDTO (pawnId, field.coordinates.x, field.coordinates.y, field.coordinates.z, gameState.deckState.selectedCards);
			try {
				const request = {
					method: "POST",
					headers: {
						"Accept": "application/json",
						"Content-Type": "application/json"
					},
					body: JSON.stringify(requestDTO)
				}
				console.log(request);
		
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
	selectedCards: string[];
	
	constructor (pawnId: number, x: number, y: number, z: number, selectedCards: string[]) {
		this.pawnId = pawnId;
		this.x = x;
		this.y = y;
		this.z = z;
		this.selectedCards = selectedCards;
	}
}

class DeniedRequestDTO {
	message: string;
	
	constructor (message: string) {
		this.message = message;
	}
}