import React, { useState } from 'react'
import { Button, Switch } from '@dhis2/ui'
import i18n from '../../../../locales'
import { UPDATE_TABLE } from '../../../../reducers/tableReducer'
import styles from './styles/HighlightingEditor.style'
import {
    useTableDispatch,
    useTableState,
} from '../../../../context/tableContext'
import {
    HighlightingEditorDialog,
    defaultIntervals,
} from './HighlightingEditorDialog'
import { getIntervalString } from './getIntervalString'

export function HighlightingEditor() {
    const table = useTableState()
    const dispatch = useTableDispatch()
    const [modalIsOpen, setModalIsOpen] = useState(false)

    const toggleModal = () => setModalIsOpen(state => !state)

    function onSwitch({ checked }) {
        dispatch({
            type: UPDATE_TABLE,
            payload: {
                highlightingOn: !table.highlightingOn,
                highlightingIntervals:
                    checked && !table.highlightingIntervals
                        ? defaultIntervals
                        : table.highlightingIntervals,
            },
        })
    }

    function onSave(highlightingIntervals) {
        dispatch({
            type: UPDATE_TABLE,
            payload: { highlightingIntervals },
        })
    }

    return (
        <div>
            <h6 className="label">{i18n.t('Enable highlighting')}</h6>
            <Switch
                checked={table.highlightingOn}
                label={i18n.t('Highlight cells based on value')}
                onChange={onSwitch}
            />
            {table.highlightingOn && (
                <>
                    <h6 className="label">{i18n.t('Highlighting rules')}</h6>
                    <div className="rules-text">
                        {getIntervalString(table.highlightingIntervals)}
                    </div>
                    <Button small onClick={toggleModal}>
                        {i18n.t('Configure highlighting')}
                    </Button>
                </>
            )}
            <HighlightingEditorDialog
                open={modalIsOpen}
                toggle={toggleModal}
                highlightingIntervals={table.highlightingIntervals}
                onSave={onSave}
            />
            <style jsx>{styles}</style>
        </div>
    )
}

HighlightingEditor.propTypes = {}

export default HighlightingEditor
