import React, { useState } from "react";
import type { GameState } from "./State/GameState";
import { InitiatingGame } from "./Phases/InitiatingGame";
import { RunningGame } from "./Phases/RunningGame";
import { EndedGame } from "./Phases/EndedGame";
import "./Game.css";

export function Game() {

    const [ gameState, setGameState ] = useState<GameState | undefined>(undefined);

	if (!gameState) {
		return <InitiatingGame setGameState={setGameState} />
	} else {
		if (!gameState.winner) {
			return <RunningGame gameState={gameState} setGameState={setGameState} />
		} else {
			return <EndedGame/>
		}
	}	
}