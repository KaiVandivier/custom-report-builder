import React, { useState, useRef, useEffect } from 'react'
import { PropTypes } from '@dhis2/prop-types'
import { useDataEngine } from '@dhis2/app-runtime'
import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    Button,
    ButtonStrip,
} from '@dhis2/ui'
import { debounce } from 'lodash'
import i18n from '../../../locales'

import DataTypes from './DataTypesSelector'
import Groups from './Groups'
import FilterField from './FilterField'
import DimensionItemsMenu from './DimensionItemsMenu'
import { modal, modalContent } from './styles/DataSelectorModal.module.css'

import {
    DEFAULT_DATATYPE_ID,
    ALL_ID,
    dataTypes,
    defaultGroupId,
    defaultGroupDetail,
} from '../../../modules/dataTypes'
import { fetchGroups, fetchAlternatives } from '../../../api/dimensions'

const FIRST_PAGE = 1

const DEFAULT_ALTERNATIVES = {
    dimensionItems: [],
    nextPage: FIRST_PAGE,
}

export const DataSelectorModal = ({
    onClose,
    onSave,
    displayNameProp = 'displayName',
}) => {
    // TODO: Receive initial data from props, e.g. data type & field name if there is a previously defined data chosen for this cell

    const engine = useDataEngine()

    // State
    // TODO: Seed values from props
    const [selectedItem, setSelectedItem] = useState(null) // maybe lift up to parent
    const [dataType, setDataType] = useState(DEFAULT_DATATYPE_ID)
    const [filterText, setFilterText] = useState('')
    const [groups, setGroups] = useState({
        indicators: [],
        dataElements: [],
        dataElementOperands: [],
        dataSets: [],
        eventDataItems: [],
        programIndicators: [],
    })
    const [groupId, setGroupId] = useState(ALL_ID)
    const [groupDetail, setGroupDetail] = useState('')
    const [nextPage, setNextPage] = useState(null)
    const [items, setItems] = useState([])
    const [filter, setFilter] = useState({})

    const debouncedUpdateRef = useRef(debounce(console.table, 300))

    const handleSave = () => {
        onSave({
            dataType: 'Indicator', // TODO: Make dynamic
            dataName: selectedItem.name,
            dataId: selectedItem.id,
            // TODO: Other fields: dataset, data elements; idk
        })
    }

    // Start function handlers copied from analytics
    // ---------------------------------------------

    async function updateGroups() {
        console.log('updateGroups')

        // If groups are already populated, update results & return
        if (groups[dataType].length) {
            updateAlternatives()
            return
        }

        // TODO: 1. Fetch groups belonging to this datatype
        const dataTypeGroups = await fetchGroups(
            engine,
            dataType,
            displayNameProp
        )

        // Update `groups` in state to include value for current data type
        setGroups({ ...groups, [dataType]: dataTypeGroups })

        // Refetch dimension results
        // updateAlternatives()
    }

    // Load on component mount and update when dataType changes
    useEffect(() => {
        // TODO: This will probably be needed for updateAlternatives() too
        updateGroups()
    }, [dataType])

    async function onDataTypeChange(newDataType) {
        console.log('onDataTypeChange')

        // If data type has not changed, return
        if (newDataType === dataType) return

        // Update `filter` to include settings from previously selected dataType
        const newFilter = {
            ...filter,
            [dataType]: { groupId, groupDetail },
        }

        // Get current filter settings: from state or defaults
        const currentFilter = filter[newDataType] || {}
        const currentGroupId =
            currentFilter.groupId || defaultGroupId(newDataType)
        const currentGroupDetail =
            currentFilter.groupDetail || defaultGroupDetail(newDataType)

        // Update state
        setFilter(newFilter)
        setDataType(() => newDataType)
        setGroupId(currentGroupId)
        setGroupDetail(currentGroupDetail)
        setFilterText('')

        // Update groups via query
        // updateGroups()
        // NOTE: This is handled by useEffect, actually
    }

    // TODO: Trigger this upon scrolling to bottom of first page of results
    function requestMoreItems() {
        console.log('requestMoreItems')

        if (!nextPage) return

        console.log('requesting more items due to scroll')
        updateAlternatives(nextPage, true)
    }

    // TODO: Debounce me!
    async function updateAlternatives(page = FIRST_PAGE, concatItems = false) {
        console.log('update alternatives')

        // 1. Make query with correct resource and params
        const alternatives =
            (await fetchAlternatives({
                engine,
                dataType,
                groupId,
                groupDetail,
                page,
                filterText,
                nameProp: displayNameProp,
            })) || DEFAULT_ALTERNATIVES

        // 2. Parse dimension items
        let { dimensionItems } = alternatives

        // 3. Augment dimension items (for `data set`)
        const augmentFn = dataTypes[dataType].augmentAlternatives
        if (augmentFn) {
            dimensionItems = augmentFn(dimensionItems, groupId)
        }

        // 4. Concatenate new items onto previous page(s) if called for
        const newItems = concatItems
            ? items.concat(dimensionItems)
            : dimensionItems

        // 5. Update state: `items`, `itemsCopy`, and `nextPage`
        // NOTE: Filtering for selected item in step 6 is unnecessary for this interface
        setItems(() => newItems)
        setNextPage(() => alternatives.nextPage)
    }

    useEffect(() => {
        // TODO: debounce
        updateAlternatives()
        // TODO: Remove test
        debouncedUpdateRef.current({
            engine,
            dataType,
            groupId,
            groupDetail,
            filterText,
            nameProp: displayNameProp,
        })
    }, [engine, dataType, groupId, groupDetail, filterText, displayNameProp])

    async function onGroupChange(newGroupId) {
        console.log('onGroupChange')

        if (newGroupId === groupId) return

        setGroupId(newGroupId)
        // updateAlternatives()
    }

    function onDetailChange(newGroupDetail) {
        console.log('onDetailChange', newGroupDetail)

        if (newGroupDetail === groupDetail) return

        setGroupDetail(newGroupDetail)
        // updateAlternatives()
    }

    function onClearFilter() {
        console.log('onClearFilter')

        setFilterText('')
        // updateAlternatives()
    }

    function onFilterTextChange(filterText) {
        console.log('onFilterTextChange')

        setFilterText(filterText)
        // updateAlternatives()
    }

    function filterZone() {
        return (
            <div>
                <DataTypes
                    currentDataType={dataType}
                    onChange={onDataTypeChange}
                />
                <Groups
                    dataType={dataType}
                    groups={groups[dataType] || []}
                    groupId={groupId}
                    onGroupChange={onGroupChange}
                    onDetailChange={onDetailChange}
                    detailValue={groupDetail}
                />
                <FilterField
                    text={filterText}
                    onFilterTextChange={onFilterTextChange}
                    onClearFilter={onClearFilter}
                />
            </div>
        )
    }

    return (
        <Modal className={modal}>
            <ModalTitle>{i18n.t('Choose data for cell')}</ModalTitle>
            <ModalContent className={modalContent}>
                {/* TODO: Row & column names */}
                {filterZone()}
                <DimensionItemsMenu
                    items={items}
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                    requestMoreItems={requestMoreItems}
                />
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

DataSelectorModal.propTypes = {
    displayNameProp: PropTypes.string,
    onClose: PropTypes.func,
    onSave: PropTypes.func,
}
