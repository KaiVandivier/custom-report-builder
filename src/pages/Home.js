import React from 'react'
import i18n from '../locales'
import { Link } from 'react-router-dom'

// import IconTest from './home/IconTest'
// import PeriodSelectTest from './home/PeriodSelectTest'
// import OrganisationUnitPicker from '../components/OrganisationUnitPicker'
// import ReportParameters from './tables/generated-table/ReportParameters'
// import ContentTypeSelector from './tables/edit-table-template/ContentTypeSelector'
import IconTooltipButton from '../components/IconTooltipButton'

export const Home = () => {
    return (
        <div>
            <h1>{i18n.t('Hello, world!')}</h1>
            <p>
                Hello! This is a work in progress. Take a look at the{' '}
                <Link to="/tables">&ldquo;Custom tables&rdquo; page</Link> for
                recent updates.
            </p>
            <IconTooltipButton
                icon="mood"
                tooltip="hello!"
                onClick={() => console.log('hello!')}
                size={'32px'}
            />
        </div>
    )
}
