import React, { Component } from 'react'
import { PropTypes } from '@dhis2/prop-types'
import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    Button,
    ButtonStrip,
} from '@dhis2/ui'
// import { debounce } from 'lodash'
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

export class DataSelectorModal extends Component {
    // TODO: Receive initial data from props, e.g. data type & field name if there is a previously defined data chosen for this cell

    // const engine = useDataEngine()

    // defaults
    state = {
        dataType: DEFAULT_DATATYPE_ID,
        groups: {
            indicators: [],
            dataElements: [],
            dataElementOperands: [],
            dataSets: [],
            eventDataItems: [],
            programIndicators: [],
        },
        groupId: ALL_ID,
        groupDetail: '',
        filterText: '',
        items: [],
        nextPage: null,
        filter: {},
        selectedItem: null,
    }

    componentDidMount() {
        this.updateGroups()
    }

    handleSave = () => {
        this.props.onSave({
            dataType: 'Indicator', // TODO: Make dynamic
            dataName: this.state.selectedItem.name,
            dataId: this.state.selectedItem.id,
            // TODO: Other fields: dataset, data elements; idk
        })
    }

    // Start function handlers copied from analytics
    // ---------------------------------------------

    updateGroups = async () => {
        console.log('updateGroups')

        const { groups, dataType } = this.state

        // If groups are already populated, update alternatives & return
        if (groups[dataType].length) {
            this.updateAlternatives()
            return
        }

        // Else, 1. Fetch groups belonging to this datatype
        const dataTypeGroups = await fetchGroups(
            this.props.engine,
            dataType,
            this.props.displayNameProp
        )

        // Update `groups` in state to include value for current data type
        // and update alternatives
        this.setState(
            { groups: { ...groups, [dataType]: dataTypeGroups } },
            this.updateAlternatives
        )
    }

    onDataTypeChange = async newDataType => {
        console.log('onDataTypeChange')

        const { dataType, groupId, groupDetail, filter } = this.state

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

        // Update state and groups
        this.setState(
            {
                filter: newFilter,
                dataType: newDataType,
                groupId: currentGroupId,
                groupDetail: currentGroupDetail,
                filterText: '',
            },
            this.updateGroups
        )
    }

    // TODO: Trigger this upon scrolling to bottom of first page of results
    requestMoreItems = () => {
        console.log('requestMoreItems')

        if (!this.state.nextPage) return
        this.updateAlternatives(this.state.nextPage, true)
    }

    // TODO: Debounce me!
    updateAlternatives = async (page = FIRST_PAGE, concatItems = false) => {
        console.log('update alternatives')

        const { dataType, groupId, groupDetail, filterText } = this.state

        // 1. Make query with correct resource and params
        const alternatives =
            (await fetchAlternatives({
                engine: this.props.engine,
                dataType,
                groupId,
                groupDetail,
                page,
                filterText,
                nameProp: this.props.displayNameProp,
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
            ? this.state.items.concat(dimensionItems)
            : dimensionItems

        // 5. Update state: `items` and `nextPage`
        // NOTE: Filtering for selected item in step 6 is unnecessary for this interface
        this.setState({ items: newItems, nextPage: alternatives.nextPage })
    }

    onGroupChange = newGroupId => {
        console.log('onGroupChange')

        if (newGroupId === this.state.groupId) return

        this.setState({ groupId: newGroupId }, this.updateAlternatives)
    }

    onDetailChange = newGroupDetail => {
        console.log('onDetailChange', newGroupDetail)

        if (newGroupDetail === this.state.groupDetail) return

        this.setState({ groupDetail: newGroupDetail }, this.updateAlternatives)
    }

    onClearFilter = () => {
        console.log('onClearFilter')
        // TODO: debounce
        this.setState({ filterText: '' }, this.updateAlternatives)
    }

    onFilterTextChange = filterText => {
        console.log('onFilterTextChange')
        // TODO: debounce
        this.setState({ filterText }, this.updateAlternatives)
    }

    render() {
        const filterZone = () => {
            return (
                <div>
                    <DataTypes
                        currentDataType={this.state.dataType}
                        onChange={this.onDataTypeChange}
                    />
                    <Groups
                        dataType={this.state.dataType}
                        groups={this.state.groups[this.state.dataType] || []}
                        groupId={this.state.groupId}
                        onGroupChange={this.onGroupChange}
                        onDetailChange={this.onDetailChange}
                        detailValue={this.state.groupDetail}
                    />
                    <FilterField
                        text={this.state.filterText}
                        onFilterTextChange={this.onFilterTextChange}
                        onClearFilter={this.onClearFilter}
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
                        items={this.state.items}
                        selectedItem={this.state.selectedItem}
                        setSelectedItem={item =>
                            // TODO: Refactor into discrete function
                            this.setState({ selectedItem: item })
                        }
                        requestMoreItems={this.requestMoreItems}
                    />
                </ModalContent>
                <ModalActions>
                    <ButtonStrip end>
                        <Button onClick={this.props.onClose}>Cancel</Button>
                        <Button primary onClick={this.handleSave}>
                            Save
                        </Button>
                    </ButtonStrip>
                </ModalActions>
            </Modal>
        )
    }
}

DataSelectorModal.propTypes = {
    engine: PropTypes.shape({ query: PropTypes.func }).isRequired,
    displayNameProp: PropTypes.string,
    onClose: PropTypes.func,
    onSave: PropTypes.func,
}

DataSelectorModal.defaultProps = {
    displayNameProp: 'displayName',
}
