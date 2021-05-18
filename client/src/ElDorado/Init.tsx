import React,{useEffect} from "react";
import type { GameState } from "../gameState";
import "./Init.css";

type InitProps = {
    setGameState(newGameState: GameState): void
}

export function Init({ setGameState }: InitProps) {
	
	async function tryInit() {
		try {

	        const response = await fetch('eldorado/api/getmap')
			
	        if (response.ok) {
	            const gameState_raw = await response.json()
				setGameState(gameState_raw)
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