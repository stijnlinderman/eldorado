import type { GameState } from "../State/GameState";
import { MapDisplay } from "./RunningGameTable/MapDisplay";;
import { DeckDisplay } from "./RunningGameTable/DeckDisplay";
import { Header } from "../../Header";
import { Footer } from "../../Footer";
import React from "react";
import "./RunningGame.css";

type RunningGameProps = {gameState: GameState, setGameState(newGameState: GameState): void}

export function RunningGame({ gameState, setGameState }: RunningGameProps) {
	return <div className="runningGameContainer">
	<div className="deckContainer">
		<Header/>
		<DeckDisplay gameState={gameState} setGameState={setGameState}/>
		<Footer/>
	</div>
	<div className="mapContainer"><MapDisplay gameState={gameState} setGameState={setGameState}/></div>
	</div>
}