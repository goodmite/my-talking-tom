<script>
    import {onMount} from "svelte";

    export let blob1 = "";
    let audio;
    export let img;
    let isPlaying = false;

    function log(x) {
        console.log(x);
    }

    const playButtonClicked = () => {
        debugger;
        if (!isPlaying) {
            audio.play();
        } else {
            audio.pause();
        }
    }

    onMount(() => {
        audio.onpause = function () {
            setTimeout(() => {
                isPlaying = false;
            })
        };
        audio.onplay = function () {
            setTimeout(() => {
                isPlaying = true;
            })
        };
    })
</script>

<div style="background: #0000ffa3; height: 40%;" class="banner-comp">
    <div
            class="banner-img"
         style="background-image: url({img}); height: 100%;
    width: 100%; display: flex; justify-content: center; align-items: center">

        {#if !isPlaying}
            <i class="fa fa-play" on:click="{_ => playButtonClicked()}"></i>
        {:else}
            <i class="fa fa-pause" on:click="{_ => playButtonClicked()}"></i>
        {/if}

        <div style="display: none">
            <audio bind:this={audio} controls src="{blob1 || 'https://www.w3schools.com/html/horse.ogg'}"
                   id="audio"></audio>
        </div>

    </div>
</div>

<style>

    .banner-comp {
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
    }

    .fa {
        font-size: 38px;
        cursor: pointer;
        /*box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;*/
        filter: drop-shadow(0 1px 2px grey);
    }
    .banner-img{
        background-position: center;
        background-size: cover;
    }

</style>