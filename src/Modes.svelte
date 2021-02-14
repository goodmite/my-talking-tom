<script>
    export let mode;
    export let changeModeFn;

</script>

<div class="modes-comp">
    <button class="button {mode === 'cat' && 'active'}" on:click={_ => changeModeFn('cat')}>
        <img style="color: pink" src="./img/cat.svg" alt="">
    </button>
    <button class="button {mode === 'baby' && 'active'}" on:click={_ => changeModeFn('baby')}>
        <img src="./img/baby.svg" alt="">
    </button>
    <button class="button {mode === 'man' && 'active'}" on:click={_ => changeModeFn('man')}>
        <img src="./img/man.svg" alt="">
    </button>
    <button class="button {mode === 'woman' && 'active'}" on:click={_ => changeModeFn('woman')}>
        <img src="./img/woman.svg" alt="">
    </button>
</div>

<style>
    .modes-comp {
        display: flex;
        justify-content: space-around;
        min-height: 100px;
    }

    .button {
        height: 60px;
        width: 60px;
        border-radius: 50%;
        padding: 4%;
        background: white;
        outline: none;
        line-height: 10px;
        /*border: 1px solid grey;*/
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
        cursor: pointer;
    }

    .button img {
        height: 23px;
    }

    @media only screen and (max-width: 600px) {
        .button {
            height: 80px;
            width: 80px;
        }

        .button img {
            height: 100%;
        }
    }

    .active {
        filter: drop-shadow(2px 0px 7px #0099ff);
    }


</style>