import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ElDorado } from "./ElDorado/ElDorado";
import "./App.css";

export function App() {
    return (
        <Router>
            <div className="main-content">
                <Switch>
                    {/* If the user goes to any other url, show the play page */}
                    <Route path="/">
                        <ElDorado />
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}