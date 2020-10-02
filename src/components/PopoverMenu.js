import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { Button, FlyoutMenu, Popover } from '@dhis2/ui'

import Icon from './Icon'

export default function PopoverMenu({ renderButton, children }) {
    const [popoverIsOpen, setPopoverIsOpen] = useState(false)
    const buttonRef = useRef()

    const togglePopover = () => {
        setPopoverIsOpen(prevState => !prevState)
    }

    return (
        <div>
            <span ref={buttonRef}>
                {renderButton ? (
                    renderButton(togglePopover)
                ) : (
                    <Button small onClick={togglePopover}>
                        <Icon name="more_horiz" />
                    </Button>
                )}
            </span>
            {popoverIsOpen && (
                <Popover
                    arrow={false}
                    reference={buttonRef}
                    placement="bottom-start"
                    onClickOutside={togglePopover}
                >
                    <FlyoutMenu>{children(togglePopover)}</FlyoutMenu>
                </Popover>
            )}
        </div>
    )
}

PopoverMenu.propTypes = {
    children: PropTypes.func,
    renderButton: PropTypes.func,
}
