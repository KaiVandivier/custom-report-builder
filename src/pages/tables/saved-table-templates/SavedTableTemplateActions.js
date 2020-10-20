import React from 'react'
import PropTypes from 'prop-types'
import { FlyoutMenu, MenuItem } from '@dhis2/ui'
import i18n from '../../../locales'

import Icon from '../../../components/Icon'
import DeleteTableTemplate from './DeleteTableTemplate'
import PopoverButton from '../../../components/PopoverButton'

export function SavedTableTemplateActions({ onGenerate, onEdit, onDelete }) {
    return (
        <PopoverButton tooltip={i18n.t('Table actions')}>
            {togglePopover => (
                <FlyoutMenu>
                    <MenuItem
                        icon={<Icon name="play_arrow" />}
                        label={i18n.t('Generate Table')}
                        onClick={() => {
                            onGenerate()
                            togglePopover()
                        }}
                    />
                    <MenuItem
                        icon={<Icon name="edit" />}
                        label={i18n.t('View & Edit')}
                        onClick={() => {
                            onEdit()
                            togglePopover()
                        }}
                    />
                    <DeleteTableTemplate
                        onDeleteConfirmation={() => {
                            onDelete()
                            togglePopover()
                        }}
                    />
                </FlyoutMenu>
            )}
        </PopoverButton>
    )
}

SavedTableTemplateActions.propTypes = {
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onGenerate: PropTypes.func.isRequired,
}

export default SavedTableTemplateActions
