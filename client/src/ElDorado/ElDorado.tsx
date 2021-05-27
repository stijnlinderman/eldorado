import React, { useState } from "react";
import type { GameState } from "./GameState/GameState";
import { CreateGame } from "./GamePhases/CreateGame";
import { ShowGame } from "./GamePhases/ShowGame";
import { AnnounceWinner } from "./GamePhases/AnnounceWinner";
import "./ElDorado.css";

export function ElDorado() {

    const [ gameState, setGameState ] = useState<GameState | undefined>(undefined);

	return <div>
		{getHeader()}
		{getPageBasedOnGameState(gameState)}
		{getFooter()}
	</div>
	
	function getHeader () {
		return (<header>
			<h2>The Quest for</h2>
			<h1>El Dorado</h1>
		</header>)
	}

	function getPageBasedOnGameState(gameState: any) {
		if (gameState) {
			if (gameState.winner) {
				return <AnnounceWinner/>
			} else {
				return <ShowGame gameState={gameState} setGameState={setGameState} />
			}
		} else {
			return <CreateGame setGameState={setGameState} />
		}	
	}    
	
	function getFooter () {
		return (<footer>
			<h3>by Stijn Linderman</h3>
		</footer>)
	}
}