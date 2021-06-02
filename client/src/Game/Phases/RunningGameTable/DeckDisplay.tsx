import React from "react";
import type {DeckState} from "../.././State/GameState";
import "./DeckDisplay.css";

type DeckDisplayProps = {deckState: DeckState};
type CardDisplayProps = {type: string};

export function DeckDisplay({deckState} : DeckDisplayProps) {
	return <div>
		<p>Cards in your hand:</p>
		<div className="collectionOfCardsToShow">{
		deckState.hand.map((cardType: string) => {
			return <CardDisplay type={cardType}/>
		})}</div>
		<p>Cards discarded after use:<br/>{deckState.discardedAmount}</p>
		<p>Undrawn cards left in deck:<br/>{deckState.deckAmountLeft}</p>
	</div>

	function CardDisplay ({type} : CardDisplayProps) {
		return <button className={`cardButton ${type}Card`} value={type} onClick={(event) => cardButtonClicked(event)}>{type}</button>
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
}