import React, { useState } from "react";
import { Init } from "./Init";
import { Play } from "./Play";
import type { GameState } from "../gameState";
import "./ElDorado.css";

export function ElDorado() {

    const [ gameState, setGameState ] = useState<GameState | undefined>(undefined);

	if (!gameState) {
		return <Init setGameState={setGameState} />
	}	
    return <Play gameState={gameState} setGameState={setGameState} />
}