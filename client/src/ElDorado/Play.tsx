import React from "react";
import type { GameState } from "../gameState";
import "./Play.css";

const strSep = ","

type PlayProps = {
    gameState: GameState;
	setGameState(newGameState: GameState): void;
}

export function Play({ gameState, setGameState }: PlayProps) {
	return getMapAsTable(gameState)
}

function getMapAsTable(gameState: GameState) {
	let table = [];
	table.push(<tr>{getTableRowContainingDiagonals(false)}</tr>)

	for (let rowId=gameState.mapSize.rowMin; rowId<=gameState.mapSize.rowMax; rowId++) {
		if (typeof gameState.rows[rowId] !== 'undefined') {
			let row = [];
			let offsetRow = isOffsetRow(rowId);
			if (offsetRow) {
				row.push(<td key={"offsetCell"+strSep+rowId} className="fieldCell"></td>)
			}

			for (let colId=gameState.mapSize.colMin; colId<=gameState.mapSize.colMax; colId++) {
				if (shouldColBeDrawnInRow_basedOnOffset(colId, offsetRow)) {
					let cellContent;
					if (typeof gameState.rows[rowId][colId] !== 'undefined') {
						const field = gameState.rows[rowId][colId];
						const buttonText = <p>{"x "+field.x}<br/>{"y "+field.y}<br/>{"z "+field.z}</p>;
						cellContent = <button key={"button"+strSep+field.getPosKey()} className="fieldButton">{buttonText}</button>;
					}
					const leftBorder = (colId == 0) ? " leftBorder" : "";
					row.push(<td key={"cell"+strSep+rowId+strSep+colId} className={"fieldCell buttonCell"+leftBorder} colSpan="2">{cellContent}</td>);
				}
			}
			table.push(<tr key={"row"+strSep+rowId} className="tableRow">{row}</tr>)
			table.push(<tr>{getTableRowContainingDiagonals(!offsetRow)}</tr>)
		}
	}
	
	let mapTable = <table className="mapTable"><tbody>{table}</tbody></table>;
	return mapTable;
	
	function shouldColBeDrawnInRow_basedOnOffset (colId: number, offsetRow: boolean) {
		let offset = offsetRow ? 1 : 0;
		return (colId % 2 == offset)
	}
	
	function isOffsetRow (rowId: number) {
		return (rowId % 2 == 0) ? false : true
	}
	
	function getTableRowContainingDiagonals (offsetRow: boolean) {
		let diagonals = [];
		const amountOfDiagonals = gameState.mapSize.colMax - gameState.mapSize.colMin + 1;
		let upwards = !offsetRow;
		for (let i=0; i <= amountOfDiagonals; i++) {
			if (upwards) {
				diagonals.push(<td className="fieldCell diagonalCell diagonalUp"></td>);
			} else {
				diagonals.push(<td className="fieldCell diagonalCell diagonalDown"></td>);
			}
			upwards = !upwards;
		}
		return diagonals;
	}
}