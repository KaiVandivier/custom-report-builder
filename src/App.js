import React from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'
import './locales'
import './modalFix.css'

import classes from './App.module.css'
import { Navigation } from './navigation'
import { Home, Tables, Reports, NoMatch } from './pages'

/*
 * HashRouter solves the problem of route issues on DHIS instances deployed
 * at addresses other than a base domain, e.g. `play.dhis2.org/2.34.1/` or
 * `academy.demos.dhis2.org/app-dev-academy`.
 * BrowserRouter with `basename="/api/apps/app-name" can work for apps
 * deployed at domain level.
 */
const MyApp = () => {
    return (
        <HashRouter>
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
        </HashRouter>
    )
}

export default MyApp
