import React from "react";
import type { GameState } from "../gameState";
import "./Play.css";

type PlayProps = {
    gameState: GameState;
	setGameState(newGameState: GameState): void;
}

export function Play({ gameState, setGameState }: PlayProps) {
	return (<p>{gameState.fields[0]}</p>)
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