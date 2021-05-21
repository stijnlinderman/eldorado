import React,{useEffect} from "react";
import type { GameState } from "../gameState";
import { processGameStateDTO } from "../gameState";
import "./Init.css";

type InitProps = {
    setGameState(newGameState: GameState): void
}

export function Init({ setGameState }: InitProps) {
	
	async function tryInit() {
		try {
	        const response = await fetch('eldorado/api/creategame')
		
	        if (response.ok) {
	            const gameStateDTO = await response.json();
				console.log(gameStateDTO);
				const gameState = processGameStateDTO(gameStateDTO);
				console.log(gameState);
				setGameState(gameState)
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