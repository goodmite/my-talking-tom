<script>


    export let audioToggleHandler;

</script>

<div class="comp">
    <div class="recorder-container" on:click={_ => audioToggleHandler()}>
        <i class="fa fa-microphone"></i>
    </div>
    <a id="save" href="#"><img src="img/save.svg"></a>
</div>

<style>
    .comp {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 250px;
    }

    .recorder-container {
        height: 90px;
        width: 90px;
        border-radius: 50%;
        background: white;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .fa-microphone {
        font-size: 35px;
    }

</style>