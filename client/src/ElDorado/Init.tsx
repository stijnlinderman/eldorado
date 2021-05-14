import React from "react";
import type { GameState } from "../gameState";
import "./Init.css";

type InitProps = {
    setGameState(newGameState: GameState): void;
}

export function Init({ setGameState }: InitProps) {
	
	async function tryInit(e: React.FormEvent) {
		try {
			let request_JSON = {
	            method: 'GET',
	            headers: {
	                'Accept': 'application/json',
	                'Content-Type': 'application/json'
	            },
	            //body: JSON.stringify({ name: 'pietje'})
	        }
	        const response = await fetch('eldorado/api/hello')//, request_JSON)

	        if (response.ok) {
	            const gameState = await response.json();
	            setGameState(gameState);
	        } else {
	            console.error(response.statusText);
	        }
			
	    } catch (error) {
	        console.error(error.toString());
	    }
		//setGameState({text: 'Hoi'})
	}
	
	let initPage = (
		<form onSubmit={(e) => tryInit(e)}>
            <button className="tryInitButton" type="submit">
                Initiate El Dorado
            </button>
        </form>
	)

	return initPage
}