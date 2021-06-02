import type { GameState } from "../State/GameState";
import { MapDisplay } from "./RunningGameTable/MapDisplay";;
import { DeckDisplay } from "./RunningGameTable/DeckDisplay";
import React from "react";
import "./RunningGame.css";

type RunningGameProps = {gameState: GameState, setGameState(newGameState: GameState): void}

export function RunningGame({ gameState, setGameState }: RunningGameProps) {
	return <div className="runningGameContainer">
	<div className="deckContainer"><DeckDisplay deckState={gameState.deckState}/></div>
	<div className="mapContainer"><MapDisplay gameState={gameState} setGameState={setGameState}/></div>
	</div>
}