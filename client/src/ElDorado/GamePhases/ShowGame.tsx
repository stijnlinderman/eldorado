import type { Field } from "../GameState/GameState";
import { GameState } from "../GameState/GameState";
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

const alerts = {
	fieldNotFound: "Could not find the field you're looking for.'",
}

export function ShowGame({ gameState, setGameState }: GameProps) {
	const amountOfDiagonalsPerRow = gameState.mapBoundaries.lastColumnId - gameState.mapBoundaries.firstColumnId + 1;
	const amountOfRowsToDraw = gameState.mapBoundaries.lastRowId - gameState.mapBoundaries.firstRowId;
	const seperator = gameState.mapState.seperator;
	
	return (
		<table className="mapTable"><tbody>
			{createRowOfDiagonals(0, amountOfDiagonalsPerRow, true)}
			{createRowsOfFields(gameState).map((row) => row)}
		</tbody></table>
	)
	
	function createRowOfDiagonals(rowId: number, length: number, startUpwards: boolean) {
		let diagonals = [];
		let upwards = startUpwards;
		for (let i=0; i <= length; i++) {
			const rowKey = `${prefix.cell_diagonal}${seperator}${rowId}${seperator}${i}`;
			const rowClasses = `fieldCell diagonalCell ${(upwards) ? "diagonalUp" : "diagonalDown"}`;
			diagonals.push(<td key={rowKey} className={rowClasses}></td>);
			upwards = !upwards;
		}
		return <tr key={`${prefix.row_diagonals}${seperator}${rowId}`} className="tableRow">{diagonals}</tr>;
	}
	
	function createRowsOfFields (gameState: GameState) {
		const rowsOfFields = []
		for (let rowId = 0; rowId <= amountOfRowsToDraw; rowId++) {
			rowsOfFields.push(createRowOfFields(rowId, gameState))
			rowsOfFields.push(createRowOfDiagonals(rowId+1, amountOfDiagonalsPerRow, shouldRowBottomDiagonalsStartUpwards(rowId)))
		}
		return rowsOfFields;
	}
	
	function createRowOfFields (rowId: number, gameState: GameState) {
		return <tr key={`${prefix.row_fields}${seperator}${rowId}`} className="tableRow">
			{isOffsetRow(rowId) ? <td key={`${prefix.cell_offset}${seperator}${rowId}`}/> : null}
			{getFieldsRow(rowId, gameState)}
		</tr>
	}
	
	function isOffsetRow (rowId: number) {
		return (rowId % 2 == 0) ? false : true
	}
	
	function getFieldsRow(rowId: number, gameState: GameState) {
		const amountOfFields = gameState.mapBoundaries.lastColumnId - gameState.mapBoundaries.firstRowId;
		const buttons = []
		for (let columnId = 0; columnId <= amountOfFields; columnId++) {
			if (shouldColumnInRowBeDrawn(columnId, rowId)) {
				buttons.push(getButtonForTableCell(rowId, columnId));
			}
		}
		return <>
			{buttons.map((button, buttonIndexInRow) => getFieldForButton(button, rowId, buttonIndexInRow))}
		</>
	}
	
	function getFieldForButton (button: any, rowId: number, buttonIndexInRow: number) {
		const buttonKey = `${prefix.cell_field}${seperator}${rowId}${seperator}${buttonIndexInRow}`;
		const buttonClasses = `fieldCell buttonCell${(buttonIndexInRow==0) ? " leftBorder" : ""}`;
		return <td key={buttonKey} className={buttonClasses} colSpan={2}>{button}</td>
	}
	
	function shouldColumnInRowBeDrawn (columnId: number, rowId: number) {
		let offset = isOffsetRow(rowId) ? 1 : 0;
		return (columnId % 2 == offset)
	}
	
	function shouldRowBottomDiagonalsStartUpwards(rowId: number) {
		return (rowId % 2 == 0) ? false : true
	}
	
	function getButtonForTableCell (rowId: number, columnId: number) {
		const field = gameState.getFieldByRowAndColumnIds(rowId, columnId);
		if (field) {
			const buttonId = `${prefix.field_button}${seperator}${field.coordinates.key}`;
			return <button className="fieldButton" id={buttonId} onClick={(event) => fieldButtonClicked(event)}>{field.buttonContent}</button>;
		} else {
			return null;
		}
	}
	
	async function fieldButtonClicked (event: any) {
		const buttonNode = event.target;
		const xyzStringKey = buttonNode.id.replace(`${prefix.field_button}${gameState.mapState.seperator}`, "");
		const field = gameState.getFieldByXYZStringKey(xyzStringKey)
		if (field) {
			movePawnToField(field);
		} else {
			alert(alerts.fieldNotFound)
		}
	}
	
	async function movePawnToField (field: Field) {
		try {
			const pawnId = 1;
			const requestBody = {
				pawnId: pawnId,
				coordinatesToMoveTo: field.coordinates
			}
			const request = {
				method: "POST",
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json"
				},
				body: JSON.stringify(requestBody)
			}
	
			const response = await fetch("eldorado/api/movepawn", request);
			
	        if (response.ok) {
	            const gameStateDTO: GameStateDTO = await response.json();
				const gameState = new GameState(gameStateDTO);
				setGameState(gameState);
	        } else {
	            console.error(response.statusText)
	        }
	
	    } catch (error) {
	        console.error(error.toString())
	    }
	}
}