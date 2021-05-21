import React, { useState } from "react";
import { CreateGame } from "./GamePhases/CreateGame";
import { ShowGame } from "./GamePhases/ShowGame";
import type { GameState } from "./GameState/GameState";
import "./ElDorado.css";

export function ElDorado() {

    const [ gameState, setGameState ] = useState<GameState | undefined>(undefined);

	if (!gameState) {
		return <CreateGame setGameState={setGameState} />
	}	
    return <ShowGame gameState={gameState} setGameState={setGameState} />
}