import React from 'react'
import i18n from '../locales'
import styles from './styles/Home.style'
import { NavCard } from './home/index'
import { TABLES, REPORTS, HELP } from '../modules/paths'

/**
 * To be used as a home page if a tool to make report documents is added to
 * this app
 */

export const Home = () => {
    return (
        <div className="grid-container">
            <NavCard
                title={i18n.t('Custom Tables')}
                icon="table_view"
                content={i18n.t(
                    'Create, view, and edit custom tables. Text and data contents of the table can be chosen on a cell-by-cell basis.'
                )}
                action={i18n.t('View Tables')}
                path={TABLES}
            />
            <NavCard
                title={i18n.t('Custom Reports')}
                icon="article"
                content={i18n.t(
                    'Create, view, and edit custom reports. Add text, images, and DHIS assets to a printable and downloadable report document.'
                )}
                action={i18n.t('View Reports')}
                path={REPORTS}
            />
            <NavCard
                title={i18n.t('Help')}
                icon="help"
                content={i18n.t(
                    'View instructions for using the Custom Tables and Custom Reports tools.'
                )}
                action={i18n.t('View Instructions')}
                path={HELP}
            />
            <style jsx>{styles}</style>
        </div>
    )
}
