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
import { debounce } from 'lodash'
import i18n from '../../../../../locales'

import { DataTypes, Groups, FilterField, DimensionItemsMenu } from './index'
import { modal, modalContent } from './styles/DataSelectorDialog.module.css'

import {
    ALL_ID,
    DEFAULT_DATATYPE_ID,
    dataTypes,
    defaultGroupId,
    defaultGroupDetail,
} from '../../../../../modules/dataTypes'
import { fetchGroups, fetchAlternatives } from '../../../../../api/dimensions'

const FIRST_PAGE = 1

const DEFAULT_ALTERNATIVES = {
    dimensionItems: [],
    nextPage: FIRST_PAGE,
}

export class DataSelectorDialog extends Component {
    // defaults
    state = {
        dataType: this.props.initialValues.dataType || DEFAULT_DATATYPE_ID,
        groups: {
            indicators: [],
            dataElements: [],
            dataElementOperands: [],
            dataSets: [],
            eventDataItems: [],
            programIndicators: [],
        },
        groupId: this.props.initialValues.dataType
            ? defaultGroupId(this.props.initialValues.dataType)
            : ALL_ID,
        groupDetail: this.props.initialValues.groupDetail || '',
        filterText: '',
        items: [],
        nextPage: null,
        filter: {},
        selectedItem: this.props.initialValues.item || null,
    }

    componentDidMount() {
        this.updateGroups()
    }

    updateGroups = async () => {
        const { groups, dataType } = this.state

        if (groups[dataType].length) {
            this.updateAlternatives()
            return
        }

        const dataTypeGroups = await fetchGroups(
            this.props.engine,
            dataType,
            this.props.displayNameProp
        )

        this.setState(
            { groups: { ...groups, [dataType]: dataTypeGroups } },
            this.updateAlternatives
        )
    }

    onDataTypeChange = async newDataType => {
        const { dataType, groupId, groupDetail, filter } = this.state

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

    requestMoreItems = () => {
        if (!this.state.nextPage) return
        this.updateAlternatives(this.state.nextPage, true)
    }

    updateAlternatives = async (page = FIRST_PAGE, concatItems = false) => {
        const { dataType, groupId, groupDetail, filterText } = this.state

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

        let { dimensionItems } = alternatives

        const augmentFn = dataTypes[dataType].augmentAlternatives
        if (augmentFn) {
            dimensionItems = augmentFn(dimensionItems, groupId)
        }

        const newItems = concatItems
            ? this.state.items.concat(dimensionItems)
            : dimensionItems

        this.setState({ items: newItems, nextPage: alternatives.nextPage })
    }

    debouncedUpdateAlternatives = debounce(this.updateAlternatives, 300)

    onGroupChange = newGroupId => {
        if (newGroupId === this.state.groupId) return
        this.setState({ groupId: newGroupId }, this.updateAlternatives)
    }

    onDetailChange = newGroupDetail => {
        if (newGroupDetail === this.state.groupDetail) return
        this.setState({ groupDetail: newGroupDetail }, this.updateAlternatives)
    }

    onClearFilter = () => {
        this.setState({ filterText: '' }, this.debouncedUpdateAlternatives)
    }

    onFilterTextChange = filterText => {
        this.setState({ filterText }, this.debouncedUpdateAlternatives)
    }

    onSave = () => {
        this.props.onSave({
            item: this.state.selectedItem,
            dataType: this.state.dataType,
            groupId: this.state.groupId,
            groupDetail: this.state.groupDetail,
        })
        this.props.onClose()
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
            <Modal onClose={this.props.onClose} className={modal}>
                <ModalTitle>{i18n.t('Choose data for cell')}</ModalTitle>
                <ModalContent className={modalContent}>
                    {/* TODO: Row & column names */}
                    {filterZone()}
                    <DimensionItemsMenu
                        items={this.state.items}
                        selectedItem={this.state.selectedItem}
                        setSelectedItem={item =>
                            this.setState({ selectedItem: item })
                        }
                        requestMoreItems={this.requestMoreItems}
                    />
                </ModalContent>
                <ModalActions>
                    <ButtonStrip end>
                        <Button onClick={this.props.onClose}>
                            {i18n.t('Cancel')}
                        </Button>
                        <Button primary onClick={this.onSave}>
                            {i18n.t('Save')}
                        </Button>
                    </ButtonStrip>
                </ModalActions>
            </Modal>
        )
    }
}

DataSelectorDialog.propTypes = {
    engine: PropTypes.shape({ query: PropTypes.func }).isRequired,
    displayNameProp: PropTypes.string,
    initialValues: PropTypes.shape({
        dataType: PropTypes.string,
        groupDetail: PropTypes.string,
        groupId: PropTypes.string,
        item: PropTypes.shape({ id: PropTypes.string, name: PropTypes.string }),
    }),
    onClose: PropTypes.func,
    onSave: PropTypes.func,
}

DataSelectorDialog.defaultProps = {
    displayNameProp: 'displayName',
}

export default DataSelectorDialog
