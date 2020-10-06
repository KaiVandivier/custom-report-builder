import React from 'react'
import i18n from '../locales'

import { DataStoreTest } from './home/DataStoreTest'
import { DataStoreProvider } from '@dhis2/app-service-datastore'
import FlyoutMenuTest from './home/FlyoutMenuTest'
import ColumnActions from './tables/edit-table-template/ColumnActions'

export const Home = () => (
    <div>
        <h1>{i18n.t('Hello, world!')}</h1>
        <p>
            Hello! This is a work in progress. Take a look at the &ldquo;Create
            custom table template&rdquo; page for recent updates.
        </p>
        <ColumnActions />
        <p>
            <span className="material-icons">arrow_drop_down</span>
            <span className="material-icons">edit</span>
            <span className="material-icons">delete</span>
            <span className="material-icons">arrow_drop_up</span>
        </p>
        <p>
            <span className="material-icons">arrow_left</span>
            <span className="material-icons">edit</span>
            <span className="material-icons">delete</span>
            <span className="material-icons">arrow_right</span>
        </p>
        <FlyoutMenuTest />
        <DataStoreProvider namespace="customReports">
            <DataStoreTest />
        </DataStoreProvider>
    </div>
)
