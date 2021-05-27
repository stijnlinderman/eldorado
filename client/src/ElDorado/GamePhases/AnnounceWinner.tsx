import React,{useEffect} from "react";
import "./AnnounceWinner.css";

export function AnnounceWinner () {

	return <div className="winnerAnouncement">
	<p className="winnerAnouncementTitle">CONGRATULATIONS!</p>
	<p className="winnerAnouncementText">You found the treasure of El Dorado!</p>
	</div>
}