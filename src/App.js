import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './locales'
import './modalFix.css'

import classes from './App.module.css'
import { Navigation } from './navigation'
import { Home, Tables, Reports, NoMatch } from './pages'

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
                        <Route path="/tables" component={Tables} />
                        <Route path="/reports" component={Reports} />
                        <Route component={NoMatch} />
                    </Switch>
                </main>
            </div>
        </BrowserRouter>
    )
}

export default MyApp
