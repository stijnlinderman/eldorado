import React from "react";
import "./EndedGame.css";

export function EndedGame () {
	return <div className="winnerAnouncement">
	<p className="winnerAnouncementTitle">CONGRATULATIONS!</p>
	<p className="winnerAnouncementText">You found the treasure of El Dorado!</p>
	</div>
}