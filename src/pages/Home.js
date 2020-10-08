import React from 'react'
import i18n from '../locales'

// import IconTest from './home/IconTest'
// import PeriodSelectTest from './home/PeriodSelectTest'
// import OrganisationUnitPicker from '../components/OrganisationUnitPicker'
import ReportParameters from '../components/ReportParameters'

export const Home = () => {
    // const [selectedOrgUnits, setSelectedOrgUnits] = useState([])
    // console.log('selected OrgUnits', selectedOrgUnits)

    return (
        <div>
            <h1>{i18n.t('Hello, world!')}</h1>
            <p>
                Hello! This is a work in progress. Take a look at the
                &ldquo;Create custom table template&rdquo; page for recent
                updates.
            </p>
            <ReportParameters onGenerate={console.log} />
        </div>
    )
}
