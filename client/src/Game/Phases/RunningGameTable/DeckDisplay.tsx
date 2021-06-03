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
	return <div key="deckDisplay" className="deckDisplay">
		<div key="instructions1" className="instructions"><h3>1. Select a card</h3></div>
		<div key="cardsInHand" className="collectionOfCardsToShow">{
		deckState.hand.map((cardType: string, cardIndex: number) => {
			return <CardOnDisplay key={`cardOnDisplay${cardIndex}`} type={cardType}/>
		})}</div>
		<div key="instructions2" className="instructions"><h3>2. Pick a field to move to &#8594;</h3></div>
		<div key="endTurnText" className="endTurnText"><h3>or</h3></div>
		<EndTurnButton/>
		<DeckInformation/>
	</div>

	function CardOnDisplay ({type} : CardDisplayProps) {
		return <button className={`cardButton ${type}Card`} value={type} onClick={(event) => cardButtonClicked(event)}>{type}</button>
	}
	
	function EndTurnButton () {
		return <button className="endTurnButton" onClick={() => endTurnButtonClicked()}>END TURN<br/>and keep selected cards</button>
	}
	
	function DeckInformation () {
		return <div className="deckInformation">
			<p>Deck information:</p>
			<StackOfCards title={"To draw"} amount={deckState.deckAmountLeft}/>
			<StackOfCards title={"Discarded"} amount={deckState.discardedAmount}/>
		</div>
	
		function StackOfCards ({title, amount} : StackOfCardsProps) {
			return <button className={"stackOfCards"} disabled>{title}:<br/><br/>{amount}</button>
		}
	}

	function cardButtonClicked (event: any) {
		const cardButton = event.target;
		const card = cardButton.value;
		if (cardButton.classList.contains("selectedCard")) {
			deckState.removeCardFromSelection(card);
			cardButton.classList.remove("selectedCard");
		} else {
			deckState.addCardToSelection(card);
			cardButton.classList.add("selectedCard");
		}
	}
	
	async function endTurnButtonClicked () {
		tryEndTurn ()
			
		async function tryEndTurn () {
			try {
				const requestDTO: EndTurnRequestDTO = new EndTurnRequestDTO (gameState.deckState.selectedCards);

				const request = {
					method: "POST",
					headers: {
						"Accept": "application/json",
						"Content-Type": "application/json"
					},
					body: JSON.stringify(requestDTO)
				}
				console.log(request)
		
				const response = await fetch("eldorado/api/endturn", request);
				
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

class EndTurnRequestDTO {
	selectedCards: string[];
	
	constructor (selectedCards: string[]) {
		this.selectedCards = selectedCards;
	}
}