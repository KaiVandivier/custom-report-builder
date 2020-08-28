import React from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { PropTypes } from '@dhis2/prop-types'
import { Menu, MenuItem } from '@dhis2/ui'
import i18n from '../locales'

// TODO: i18n

const NavigationItem = ({ path, label }) => {
    // browser history object
    const history = useHistory()

    // "null" when not active, "object" when active
    const routeMatch = useRouteMatch(path)
    // If "isActive" is not null and "isActive.isExact" is true
    const isActive = routeMatch?.isExact

    // Callback called when clicking on the menu item.
    // If the menu item is not active, navigate to the path
    const onClick = () => !isActive && history.push(path)

    return <MenuItem label={label} active={isActive} onClick={onClick} />
}

NavigationItem.propTypes = {
    label: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
}

export const Navigation = () => (
    <Menu>
        <NavigationItem label={i18n.t('Home')} path="/" />

        <NavigationItem
            label={i18n.t('Create Custom Table Template')}
            path="/table-template"
        />

        <NavigationItem
            label={i18n.t('Generate Custom Table from Template')}
            path="/generate-table"
        />

        <NavigationItem
            label={i18n.t('Create Custom Report Template')}
            path="/report-template"
        />

        <NavigationItem
            label={i18n.t('Generate Custom Report from Template')}
            path="/generate-Report"
        />
    </Menu>
)
