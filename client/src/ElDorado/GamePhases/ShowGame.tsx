import React from "react";
import type { GameState } from "../GameState/GameState";
import "./ShowGame.css";

type ViewGameProps = {
    gameState: GameState;
}

export function ShowGame({ gameState }: ViewGameProps) {
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
			diagonals.push(<td key={`cellContainingDiagonal${seperator}${rowId}${seperator}${i}`} className={`fieldCell diagonalCell ${(upwards) ? "diagonalUp" : "diagonalDown"}`}></td>);
			upwards = !upwards;
		}
		return <tr key={`rowOfDiagonals${seperator}${rowId}`} className="tableRow">{diagonals}</tr>;
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
		return <tr key={`rowOfFields${seperator}${rowId}`} className="tableRow">
			{isOffsetRow(rowId) ? <td key={`cellToCreateOffset${seperator}${rowId}`}/> : null}
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
				const field = gameState.getFieldByRowAndColumnIds(rowId, columnId);
				buttons.push((field) ? <button key={`button${seperator}${field.coordinates.key}`} className="fieldButton">{field.buttonContent}</button> : null);
			}
		}
		return <>
			{buttons.map((button, buttonIndexInRow) => <td key={`cellContainingField${seperator}${rowId}${seperator}${buttonIndexInRow}`} className={`fieldCell buttonCell${(buttonIndexInRow==0) ? " leftBorder" : ""}`} colSpan={2}>{button}</td>)}
		</>
	}
	
	function shouldColumnInRowBeDrawn (columnId: number, rowId: number) {
		let offset = isOffsetRow(rowId) ? 1 : 0;
		return (columnId % 2 == offset)
	}
	
	function shouldRowBottomDiagonalsStartUpwards(rowId: number) {
		return (rowId % 2 == 0) ? false : true
	}

}