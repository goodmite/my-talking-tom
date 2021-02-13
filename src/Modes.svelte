<script>
    export let mode;
    export let changeModeFn;

</script>

<div class="modes-comp">
    <button class="button" on:click={_ => changeModeFn('cat')}>
        <img style="color: pink" src="./img/cat.svg" alt="">
    </button>
    <button class="button" on:click={_ => changeModeFn('baby')}>
        <img src="./img/baby.svg" alt="">
    </button>
    <button class="button" on:click={_ => changeModeFn('man')}>
        <img src="./img/man.svg" alt="">
    </button>
    <button class="button" on:click={_ => changeModeFn('woman')}>
        <img src="./img/woman.svg" alt="">
    </button>
</div>

<style>
    .modes-comp {
        display: flex;
        justify-content: space-around;
    }

    .button {
        height: 32px;
        width: 54px;
        background: white;
        outline: none;
        line-height: 10px;
        border-radius: 10px;
        /*border: 1px solid grey;*/
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .button img {
        height: 23px;
    }


</style>