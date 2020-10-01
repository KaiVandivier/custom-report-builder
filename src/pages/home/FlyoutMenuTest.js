import React, { useState, useRef } from 'react'
import {
    Button,
    FlyoutMenu,
    MenuItem,
    MenuSectionHeader,
    Popover,
} from '@dhis2/ui'
import i18n from '../../locales'

import Icon from '../../components/Icon'

export default function FlyoutMenuTest() {
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
                        <MenuSectionHeader
                            dense
                            label={i18n.t('Menu header')}
                        />
                        <MenuItem
                            dense
                            icon={<Icon name="play_arrow" dense />}
                            label={i18n.t('Generate Table')}
                        />
                        <MenuItem
                            dense
                            icon={<Icon name="edit" dense />}
                            label={i18n.t('View & Edit')}
                        />
                        <MenuItem
                            dense
                            icon={<Icon name="delete" dense />}
                            label={i18n.t('Delete')}
                        />
                    </FlyoutMenu>
                </Popover>
            )}
        </div>
    )
}
