import React, { useState } from 'react'
import { PeriodDimension } from '@dhis2/analytics'

export default function PeriodSelectTest() {
    const [selectedPeriods /* , setSelectedPeriods */] = useState([])
    return (
        <PeriodDimension
            selectedPeriods={selectedPeriods}
            onSelect={console.log}
        />
    )
}
