import React from "react";
import type { GameState } from "../gameState";
import "./Play.css";

let fieldButtonW: number = 30
let fieldButtonH: number = 50

type PlayProps = {
    gameState: GameState;
	setGameState(newGameState: GameState): void;
}

export function Play({ gameState, setGameState }: PlayProps) {
	let field = new Field(gameState.pos.x, gameState.pos.y, gameState.pos.z)
	let fieldAsElement = field.getAsElement()
    return fieldAsElement
}

class Field {
	x: number;
	y: number;
	z: number;
	
	constructor(x:number, y:number, z:number) {
		this.x = x
		this.y = y
		this.z = z
	}
	
	getAsElement () {
		let buttonText: string = this.x + ',' + this.y + ',' + this.z
		return <button className="fieldButton">{buttonText}</button>
	}
}