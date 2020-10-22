import css from 'styled-jsx/css'

export default css`
    .header {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
        gap: 1rem;
    }

    h1 {
        margin-top: 0;
        margin-bottom: 0;
    }

    .editButton {
        margin-right: auto;
    }

    .tableButtons {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.75rem;
    }

    .tableButtons__left {
        margin-right: auto;
    }

    .tableButtons__right {
        margin-left: auto;
    }

    .cardContainer {
        height: min-content;
    }

    .help {
        margin-top: 1rem;
        margin-bottom: 1rem;
    }
`
