import React from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'
import './locales'
import './styles/modalFix.css'

import globalStyles from './styles/global.style'
import classes from './App.module.css'
import { TABLES } from './modules/paths'
import { Tables, NoMatch } from './pages'
// import { Navigation } from './navigation'

// If report documents are added to this app (may become separate app):
// - Add navigation, with layout container and sidebar (styled `.left`)
// - Add homepage
// - Add routes and paths for reports components

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
                <main className={classes.right}>
                    <Switch>
                        <Route path={TABLES} component={Tables} />
                        <Route component={NoMatch} />
                    </Switch>
                </main>
            </div>
            <style jsx global>
                {globalStyles}
            </style>
        </HashRouter>
    )
}

export default MyApp
