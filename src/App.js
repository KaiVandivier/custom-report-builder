import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './locales'

import classes from './App.module.css'
import { Navigation } from './navigation'
import {
    Home,
    TableTemplate,
    GenerateTable,
    ReportTemplate,
    GenerateReport,
} from './pages'

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
                        <Route
                            exact
                            path="/table-template"
                            component={TableTemplate}
                        />
                        <Route
                            exact
                            path="/generate-table"
                            component={GenerateTable}
                        />
                        <Route
                            exact
                            path="/report-template"
                            component={ReportTemplate}
                        />
                        <Route
                            exact
                            path="/generate-report"
                            component={GenerateReport}
                        />
                    </Switch>
                </main>
            </div>
        </BrowserRouter>
    )
}

export default MyApp
