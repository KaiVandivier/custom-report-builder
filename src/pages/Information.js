/* eslint-disable react/no-unescaped-entities */

import React from 'react'
// import PropTypes from 'prop-types'
import Icon from '../components/Icon'
import styles from './styles/Information.style'

export function Information() {
    return (
        <section className="main">
            <h1>Information</h1>

            <div className="divider" />

            <h2>Custom Tables</h2>
            <h3>Editing a table template</h3>
            <ol>
                <li>
                    <strong>Make a new row or column</strong> by pressing one of
                    the "Add Row" or "Add Column" buttons at the top left of the
                    table editing page.
                </li>
                <li>
                    You may{' '}
                    <strong>choose dimensions for each row or column</strong>{' '}
                    that will be applied to each cell in that row or column.
                    <ul>
                        <li>
                            To do so, click on the Row or Column Actions menu (
                            <Icon name="more_vert" />) and select "Assign
                            row/column dimensions."
                        </li>
                        <li>
                            You may select data, organisation units, or periods
                            for the row or column.
                        </li>
                        <li>
                            The chosen dimensions will be added as filters to
                            all the existing cells in the row or column, as well
                            as to any new cells to the row or column.
                        </li>
                        <li>
                            A cell in that row or column may later have the
                            chosen dimension changed individually, independent
                            of the row or column.
                        </li>
                    </ul>
                </li>
                <li>
                    <strong>
                        Choose the contents of each cell individually
                    </strong>{' '}
                    using the tools in each cell.
                    <ul>
                        <li>
                            The content type of each cell can be chosen using
                            the menu: it may either be <strong>data</strong>{' '}
                            queried from analytics, <strong>static text</strong>
                            , or <strong>empty</strong>.
                        </li>
                        <li>
                            Once the type of content is selected, click on a
                            value in the cell to open a dialog to edit it.
                        </li>
                        <li>
                            <strong>
                                To use a table-wide value of organisation unit
                                or period as filter(s)
                            </strong>{' '}
                            for a data cell, leave the respective values as
                            undefined in the template, and choose those values
                            when a table is generated from the template.
                        </li>
                    </ul>
                </li>
            </ol>

            <h3>Generating a table</h3>
            <ol>
                <li>
                    Upon generating a table from a template,{' '}
                    <strong>
                        use the dialog to choose organisation unit(s) and
                        period(s)
                    </strong>{' '}
                    to use as filters for the data-containing cells in the
                    table.
                    <ul>
                        <li>
                            Any cells without organisation unit(s) or period(s)
                            defined in the table template will use these values
                            as filters.
                        </li>
                        <li>
                            As of now, both organisation unit and period must
                            have a selected value to generate the table.
                        </li>
                    </ul>
                </li>
                <li>
                    <strong>To print the table</strong>, press the "Print"
                    button to open up a print dialog that will print just the
                    table document.
                </li>
                <li>
                    <strong>Inspect cell definitions</strong> by hovering the
                    mouse over a data-containing cell to see its data item and
                    filter parameters.
                </li>
            </ol>

            <div className="divider" />

            <h2>Custom Reports</h2>
            <p>This feature will be added in the future.</p>
            <style jsx>{styles}</style>
        </section>
    )
}

Information.propTypes = {}

export default Information
