import css from 'styled-jsx/css'

export default css`
    .switch-container {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .editor-container {
        display: block;
        max-width: 400px;
        margin-top: 0.5rem;
    }

    .interval-container {
        display: flex;
        align-items: center;
        min-height: 2rem;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .color-swatch-container {
        display: inline-block;
        padding: 0.25rem;
        // background-color: white;
        // border: 1px solid #ccc; // TODO: Get right color
        border-radius: 0.25rem;
    }

    .color-swatch {
        height: 1rem;
        width: 2rem;
        border: 1px solid #666; // TODO: Get right color
    }

    .color-swatch.green {
        background-color: #e8f5e9; // TODO: Get right color
    }

    .color-swatch.yellow {
        background-color: #ffecb3; // TODO: Get right color
    }

    .color-swatch.red {
        background-color: #ffe5e8; // TODO: Get right color
    }
`
