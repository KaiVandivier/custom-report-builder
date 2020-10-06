import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { Button, FlyoutMenu, MenuItem, Popover } from '@dhis2/ui'
import i18n from '../../../locales'

import Icon from '../../../components/Icon'
import DeleteTableTemplate from './DeleteTableTemplate'

// TODO: Execute actions on click (and close the menu)

export default function SavedTableTemplateActions({
    onGenerate,
    onEdit,
    onDelete,
}) {
    const [popoverIsOpen, setPopoverIsOpen] = useState(false)
    const buttonRef = useRef()

    const togglePopover = () => {
        setPopoverIsOpen(prevState => !prevState)
    }

    return (
        <div>
            <span ref={buttonRef}>
                <Button small onClick={togglePopover}>
                    <span className="material-icons">more_horiz</span>
                </Button>
            </span>
            {popoverIsOpen && (
                <Popover
                    arrow={false}
                    reference={buttonRef}
                    placement="bottom-start"
                    onClickOutside={togglePopover}
                >
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
                </Popover>
            )}
        </div>
    )
}

SavedTableTemplateActions.propTypes = {
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onGenerate: PropTypes.func.isRequired,
}
