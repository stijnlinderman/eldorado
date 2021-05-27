import React,{useEffect} from "react";
import { GameState } from "../GameState/GameState";
import type { GameStateDTO } from "../GameState/GameStateDTO";
import "./CreateGame.css";

type createGameProps = {
    setGameState(newGameState: GameState): void
}

export function CreateGame ({ setGameState }: createGameProps) {
	
	async function tryInit() {
		try {
	        const response = await fetch("eldorado/api/creategame")
		
	        if (response.ok) {
	            const gameStateDTO: GameStateDTO = await response.json();
				console.log(gameStateDTO);
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