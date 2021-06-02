import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Game } from "./Game/Game";
import { Header } from "./Header";
import { Footer } from "./Footer";
import "./App.css";

export function App() {
    return (
        <Router>
            <div className="main-content">
				<Header/>
	                <Switch>
	                    {/* If the user goes to any other url, show the play page */}
	                    <Route path="/">
	                        <Game />
	                    </Route>
	                </Switch>
				<Footer/>
            </div>
        </Router>
    )
}