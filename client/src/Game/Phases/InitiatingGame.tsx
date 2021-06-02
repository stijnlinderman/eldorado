import React,{useEffect} from "react";
import { GameState } from "../State/GameState";
import type { GameStateDTO } from "../State/GameStateDTO";
import "./InitiatingGame.css";

type createGameProps = {
    setGameState(newGameState: GameState): void
}

export function InitiatingGame ({ setGameState }: createGameProps) {
	
	async function tryInit() {
		try {
	        const response = await fetch("eldorado/api/creategame")
		
	        if (response.ok) {
	            const gameStateDTO: GameStateDTO = await response.json();
				setGameState(new GameState(gameStateDTO));
	        } else {
	            console.error(response.statusText)
	        }

	    } catch (error) {
	        console.error(error.toString())
	    }
	}
	
	useEffect(() => {tryInit()}, [])

	return <p>Loading...</p>
}