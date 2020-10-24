import css from 'styled-jsx/css'
import { colors, spacers } from '@dhis2/ui'

export default css`
    .container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        font-weight: normal;
        padding: ${spacers.dp4} ${spacers.dp8};
        border-radius: ${spacers.dp4};
    }

    .container:hover,
    .container:focus {
        background: rgba(0, 0, 0, 0.05);
    }

    .container:not(:hover):not(:focus) > .icons {
        height: 0;
        overflow: hidden;
    }

    .title {
        font-size: 0.75rem;
        color: ${colors.grey700};
        margin-top: 0;
        margin-bottom: 0;
    }

    .content {
        margin-top: ${spacers.dp4};
        margin-bottom: 0;
    }

    .icons {
        display: flex;
        gap: 0.5rem;
        padding-right: 0.5rem;
    }
`
