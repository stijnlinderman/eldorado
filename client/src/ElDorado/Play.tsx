import React from "react";
import type { GameState } from "../gameState";
import "./Play.css";

type PlayProps = {
    gameState: GameState;
	setGameState(newGameState: GameState): void;
}

export function Play({ gameState, setGameState }: PlayProps) {
	console.log(gameState)
    return (
    	<div>{gameState.text}</div>
    )
}