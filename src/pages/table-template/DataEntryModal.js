import React, { useState, useRef } from 'react'
import { PropTypes } from '@dhis2/prop-types'
import { useDataQuery } from '@dhis2/app-runtime'
import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    SingleSelectField,
    SingleSelectOption,
    InputField,
    Menu,
    MenuItem,
    Button,
    ButtonStrip,
} from '@dhis2/ui'
import debounce from 'lodash/debounce'
import i18n from '../../locales'

const INDICATORS_QUERY = {
    indicators: {
        resource: 'indicators',
        params: ({ filterText = '', page = 1 }) => ({
            fields: ['id', 'displayName~rename(name)'],
            filter: filterText.length
                ? `displayName:ilike:${filterText}`
                : null,
            page,
        }),
    },
}

export const DataEntryModal = ({ onClose, onSave }) => {
    // TODO: Receive initial data from props, e.g. data type & field name if there is a previously defined data chosen for this cell

    // Practice indicators query
    const indicatorsQuery = useDataQuery(INDICATORS_QUERY)
    const { data, loading, error } = indicatorsQuery

    const [selectedItem, setSelectedItem] = useState(null) // TODO: Seed value from props
    const [filterText, setFilterText] = useState('') // TODO: Could be seeded with previous dimension name value

    const refetchToDebounce = async filterText => {
        // TODO: Make more flexible; incorporate more parameters
        indicatorsQuery.refetch({ filterText })
    }
    const debouncedRefetchRef = useRef(debounce(refetchToDebounce, 300))

    const queryResults = data => {
        console.log(data)
        return data.indicators.indicators.map(indicator => (
            <MenuItem
                label={indicator.name}
                id={indicator.id}
                key={indicator.id}
                active={indicator.id === selectedItem?.id}
                onClick={() => setSelectedItem(indicator)}
            />
        )) // TODO
    }

    // const handleDataTypeChange = () => {
    //     // TODO: Query new set of data (e.g. indicators, data sets)
    // }

    // const handleDataGroupChange = () => {
    //     // TODO: Requery current data type with new filters
    //     const result = engine.query(/* Todo */)
    // }

    const handleFilterTextChange = async ref => {
        // TODO: Make dynamic w.r.t. data type and 'name prop'
        setFilterText(ref.value)
        // updateQuery(ref.value)
        debouncedRefetchRef.current(ref.value)
    }

    // TODO: Handle 'request more items'

    const handleSave = () => {
        onSave({
            dataType: 'Indicator', // TODO: Make dynamic
            dataName: selectedItem.name,
            dataId: selectedItem.id,
            // TODO: Other fields: dataset, data elements; idk
        })
    }

    return (
        <Modal>
            <ModalTitle>{i18n.t('Choose data for cell')}</ModalTitle>
            <ModalContent>
                {/* TODO: Row & column names */}

                {/* Data TYPE Select */}
                <SingleSelectField
                    label="Data Type"
                    className="select"
                    selected="indicators" // TODO: Set this to initial value from props
                >
                    <SingleSelectOption label="Indicators" value="indicators" />
                    <SingleSelectOption
                        label="Data elements"
                        value="dataElements"
                    />
                    <SingleSelectOption label="Data sets" value="dataSets" />
                    <SingleSelectOption
                        label="Event data items"
                        value="eventDataItems"
                    />
                    <SingleSelectOption
                        label="Program indicators"
                        value="programIndicators"
                    />
                </SingleSelectField>

                {/* Data GROUP Select */}
                <SingleSelectField
                    label="Select indicator group" // TODO: Make dynamic with respect to multiple data types
                    selected=""
                ></SingleSelectField>

                {/* Filter input field */}
                <InputField
                    label="Filter"
                    onChange={
                        handleFilterTextChange
                    } /* TODO: Value and onChange */
                    value={filterText}
                />

                {/* Results */}
                <div /* TODO: Add frame styles? */>
                    <Menu>{loading || error ? null : queryResults(data)}</Menu>
                </div>
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button primary onClick={handleSave}>
                        Save
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

DataEntryModal.propTypes = {
    onClose: PropTypes.func,
    onSave: PropTypes.func,
}
