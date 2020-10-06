import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './locales'

import classes from './App.module.css'
import { Navigation } from './navigation'
import { Home, TableTemplate } from './pages'

const MyApp = () => {
    return (
        <BrowserRouter>
            <div className={classes.container}>
                <nav className={classes.left}>
                    <Navigation />
                </nav>
                <main className={classes.right}>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/tables" component={TableTemplate} />
                        <Route path="/reports" component={null} />
                    </Switch>
                </main>
            </div>
        </BrowserRouter>
    )
}

export default MyApp
