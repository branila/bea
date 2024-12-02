<footer>
    <div class="container">
        <span class="inner-container">
            Copyright &copy {new Date().getFullYear()} all rights reserved |
            Made with love and anxiety by &ZeroWidthSpace;
            <a href="https://github.com/branila">Branila</a>, &ZeroWidthSpace;
            <a href="https://github.com/Vano2903">Vano</a> &ZeroWidthSpace; and &ZeroWidthSpace;
            <a href="https://github.com/Alex-Loca">Slocax</a>
        </span>
    </div>
</footer>

<style>
    footer {
        min-height: 160px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .container {
        min-height: 80px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        border-radius: 15px;
        background-color: var(--grey);
        font-size: max(16px, 10px + 0.5vw);
        font-weight: normal;
    }

    @media (max-width: 900px) {

        .container {
            padding-inline: 20px;
        }
    }

    @media (max-width: 600px) {
        footer {
            min-height: 120px;
        }
    }

</style>
