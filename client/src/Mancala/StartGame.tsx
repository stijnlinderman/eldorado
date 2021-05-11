import React, { useState } from "react";
import type { GameState } from "../gameState";
import "./StartGame.css";

type StartGameProps = {
    setGameState(newGameState: GameState): void;
}

/**
 * Allows the players to enter their name. A name is required for both players. They can't have the same names.
 */
export function StartGame({ setGameState }: StartGameProps) {

    const [errorMessage, setErrorMessage] = useState("");
    const [playerOne, setPlayerOne] = useState("");
    const [playerTwo, setPlayerTwo] = useState("");

    async function tryStartGame(e: React.FormEvent) {
        e.preventDefault(); // Prevent default browser behavior of submitting forms
        if (!playerOne) {
            setErrorMessage("A name is required for player 1");
            return;
        }
        if (!playerTwo) {
            setErrorMessage("A name is required for player 2");
            return;
        }
        if (playerOne === playerTwo) {
            setErrorMessage("Each player should have a unique name");
            return;
        }
        setErrorMessage("");

        try {
            const response = await fetch('mancala/api/start', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nameplayer1: playerOne, nameplayer2: playerTwo })
            });

            if (response.ok) {
                const gameState = await response.json();
                setGameState(gameState);
            } else {
                console.error(response.statusText);
            }
        } catch (error) {
            console.error(error.toString());
        }
    }

    return (
        <form onSubmit={(e) => tryStartGame(e)}>
            <input value={playerOne}
                placeholder="Player 1 name"
                onChange={(e) => setPlayerOne(e.target.value)}
            />

            <input value={playerTwo}
                placeholder="Player 2 name"
                onChange={(e) => setPlayerTwo(e.target.value)}
            />

            <p className="errorMessage">{errorMessage}</p>

            <button className="startGameButton" type="submit">
                Play Mancala!
            </button>
        </form>
    )
}