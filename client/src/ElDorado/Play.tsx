import React from "react";
import type { GameState } from "../gameState";
import "./Play.css";

const strSep = ","

type PlayProps = {
    gameState: GameState;
	setGameState(newGameState: GameState): void;
}

export function Play({ gameState, setGameState }: PlayProps) {
	return getMapTableForDisplay(gameState)
}

function getMapTableForDisplay(gameState: GameState) {
	let tableContent = [];
	addRowOfDiagonals(tableContent, true)

	for (let rowId=gameState.firstRowId; rowId<=gameState.lastRowId; rowId++) {
		if (typeof gameState.rowsToDisplay[rowId] !== 'undefined') {
			let rowToDisplay = [];
			let offsetRow = isOffsetRow(rowId);
			if (offsetRow) {
				rowToDisplay.push(<td key={"offsetCell"+strSep+rowId} className="fieldCell"></td>)
			}

			for (let colId=gameState.firstColId; colId<=gameState.lastColId; colId++) {
				if (shouldColBeDrawnInThisRow_basedOnOffset(colId, offsetRow)) {
					const cellContent = getCellContent(rowId, colId)					
					let leftBorderClassToAdd = ((colId == 0 ) || (colId == 1)) ? "leftBorder": "";
					rowToDisplay.push(<td key={"cell"+strSep+rowId+strSep+colId} className={"fieldCell buttonCell"+leftBorderClassToAdd} colSpan="2">{cellContent}</td>);
				}
			}
			tableContent.push(<tr key={"row"+strSep+rowId} className="tableRow">{rowToDisplay}</tr>)
			addRowOfDiagonals(tableContent, offsetRow)
		}
	}
	
	function HexaGridRow({ row, rowId }: { row: unknown[]; rowId: string; }) {
		return <>
			{isOffsetRow(rowId) ? <OffsetCell key={`offsetCell,${rowId}`} /> : null}
			{row.map((col, colId) => <Cell key={`cell,${rowId},${colId}`} />)}
		</>;
	}
	
	return (
		<table>
			{gameState.rowsToDisplay.map((row, rowIndex) => <HexaGridRow key={rowId} row={row} rowId={rowId}/>)}
		</table>
	)
	
	let mapTableForDisplay = <table className="mapTable"><tbody>{tableContent}</tbody></table>;
	return mapTableForDisplay;
		
	function shouldColBeDrawnInThisRow_basedOnOffset (colId: number, offsetRow: boolean) {
		let offset = offsetRow ? 1 : 0;
		return (colId % 2 == offset)
	}
	
	function isOffsetRow (rowId: number) {
		return (rowId % 2 == 0) ? false : true
	}
	
	function doesCellContainAField (rowId: number, colId: number) {
		return (gameState.rowsToDisplay[rowId][colId]);
	}

	function getCellContent (rowId: number, colId: number) {
		let cellContent;
		if (doesCellContainAField(rowId, colId)) {
			const field = gameState.rowsToDisplay[rowId][colId];
			let buttonContent = (field.pawnId > 0) ? field.pawnId : "";
			cellContent = <button key={"button"+strSep+field.pos.key} className="fieldButton">{buttonContent}</button>;
		}
		return cellContent;		
	}
	

	function addRowOfDiagonals (tableContent: any[], upwards: boolean) {
		tableContent.push(<tr>{getTableRowContainingDiagonals(upwards)}</tr>)
	}

	function getTableRowContainingDiagonals (startUpwards: boolean) {
		let diagonals = [];
		let upwards = startUpwards;
		const amountOfDiagonals = gameState.lastColId - gameState.firstColId + 1;
		for (let i=0; i <= amountOfDiagonals; i++) {
			const diagonalClass = (upwards) ? "diagonalUp" : "diagonalDown";
			diagonals.push(<td className={"fieldCell diagonalCell "+diagonalClass}></td>);
			upwards = !upwards;
		}
		return diagonals;
	}
}