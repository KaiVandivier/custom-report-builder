import React from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { PropTypes } from '@dhis2/prop-types'
import { Menu, MenuItem } from '@dhis2/ui'
import i18n from '../locales'
import { TABLES, REPORTS, HELP } from '../modules/paths'

const NavigationItem = ({ path, label }) => {
    // browser history object
    const history = useHistory()

    // "null" when not active, "object" when active
    const routeMatch = useRouteMatch(path)
    // If "isActive" is not null and "isActive.isExact" is true
    const isActive = path === '/' ? routeMatch?.isExact : !!routeMatch

    // Callback called when clicking on the menu item.
    const onClick = () => history.push(path)

    return <MenuItem label={label} active={isActive} onClick={onClick} />
}

NavigationItem.propTypes = {
    label: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
}

export const Navigation = () => (
    <Menu>
        {/* <NavigationItem label={i18n.t('Home')} path="/" /> */}
        <NavigationItem label={i18n.t('Custom tables')} path={TABLES} />
        <NavigationItem label={i18n.t('Custom reports')} path={REPORTS} />
        <NavigationItem label={i18n.t('Help')} path={HELP} />
    </Menu>
)
