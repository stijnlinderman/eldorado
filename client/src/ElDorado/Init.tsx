import React,{useEffect} from "react";
import type { GameState } from "../gameState";
import { processGameState } from "../gameState";
import "./Init.css";

type InitProps = {
    setGameState(newGameState: GameState): void
}

export function Init({ setGameState }: InitProps) {
	
	async function tryInit() {
		try {
	        const response = await fetch('eldorado/api/creategame')
		
	        if (response.ok) {
	            const gameState = await response.json()
				console.log(gameState)
				processGameState(gameState)
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