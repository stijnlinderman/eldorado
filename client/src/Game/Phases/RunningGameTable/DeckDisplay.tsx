import React from "react";
import {GameState, DeckState} from "../.././State/GameState";
import type { GameStateDTO } from "../../State/GameStateDTO";
import "./DeckDisplay.css";

type DeckDisplayProps = {
	gameState: GameState,     
	setGameState(newGameState: GameState): void
};
type CardDisplayProps = {type: string};
type StackOfCardsProps = {title: string, amount: number};

export function DeckDisplay({gameState, setGameState} : DeckDisplayProps) {
	const deckState = gameState.deckState;
	return <div className="deckDisplay">
		<h3>1. Select a card</h3>
		<div className="collectionOfCardsToShow">{
		deckState.hand.map((cardType: string) => {
			return <CardOnDisplay type={cardType}/>
		})}</div>
		<h3>2. Pick a field to move to &#8594;</h3>
		<div className="endTurnText"><h3>or</h3></div><EndTurnButton/>
		<DeckInformation/>
	</div>

	function CardOnDisplay ({type} : CardDisplayProps) {
		return <button className={`cardButton ${type}Card`} value={type} onClick={(event) => cardButtonClicked(event)}>{type}</button>
	}
	
	function StackOfCards ({title, amount} : StackOfCardsProps) {
		return <button className={"stackOfCards"} disabled>{title}:<br/><br/>{amount}</button>
	}
	
	function EndTurnButton () {
		return <button className="endTurnButton" onClick={() => endTurnButtonClicked()}>End turn</button>
	}
	
	function DeckInformation () {
		return <div className="deckInformation">
			<p>Deck information:</p>
			<StackOfCards title={"To draw"} amount={deckState.deckAmountLeft}/>
			<StackOfCards title={"Discarded"} amount={deckState.discardedAmount}/>
		</div>
	}

	function cardButtonClicked (event: any) {
		const cardButton = event.target;
		if (cardButton.classList.contains("selectedCard")) {
			deckState.setSelectedCard("none");
			cardButton.classList.remove("selectedCard");
		} else if (deckState.isACardSelected()) {
			alert(`A card has already been selected. Pick a field to move or deselect the card to select another card.`);
		} else {
			deckState.setSelectedCard(event.target.value);
			cardButton.classList.add("selectedCard");
		}
	}
	
	async function endTurnButtonClicked () {
		tryEndTurn ()
			
		async function tryEndTurn () {
			try {
		        const response = await fetch("eldorado/api/endturn")
			
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
	}
}