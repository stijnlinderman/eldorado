import React from "react";
import { Header } from "../../Header";
import { Footer } from "../../Footer";
import "./EndedGame.css";

export function EndedGame () {
	return <div className="winnerAnouncement">
	<Header/>
	<p className="winnerAnouncementTitle">CONGRATULATIONS!</p>
	<p className="winnerAnouncementText">You found the treasure of El Dorado!</p>
	<Footer/>
	</div>
}