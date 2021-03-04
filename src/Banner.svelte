<script>
    import {onMount} from "svelte";
    import Carousel from '@beyonk/svelte-carousel'

    export let blob1 = "";
    export let playable = false;
    export let button, seconds;
    let carousel;
    let audio;
    export let img;
    export let mode;
    let isPlaying = false;
    export let playButtonClickedCb;

    function log(x) {
        //console.log(x);
    }

    const playButtonClicked = () => {
        playButtonClickedCb(isPlaying);
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

    $:{
        if (mode && carousel) {

            let index = 0;
            if (mode === "baby") {
                index = 1
            }
            if (mode === "child") {
                index = 0;
            }
            if (mode === "man") {
                index = 2;
            }
            if (mode === "woman") {
                index = 3;
            }
            carousel.go(index);
        }
    }
</script>

<div style="background: #0000ffa3; height: 40%; position:relative;" class="banner-comp">
    <div
            class="banner-img"
            style=" height: 100%;
    width: 100%; display: flex; justify-content: center; align-items: center">
        {#if seconds}
            <div style="position: absolute;
    top: 50%;
    z-index: 10000;
    left: 50%;
    transform: translate(-50%, -50%);
    filter: drop-shadow(0 1px 2px grey);
    font-size: 70px;">{seconds}</div>
        {/if}
        <Carousel bind:this={carousel} perPage="{1}" dots="{false}" draggable="{false}">
            <div style="background-image: url('./img/cat.svg'); background-size: contain; background-repeat: no-repeat; background-position: center;"></div>
            <div style="background-image: url('./img/baby.svg'); background-size: contain; background-repeat: no-repeat; background-position: center;"></div>
            <div style="background-image: url('./img/man.svg'); background-size: contain; background-repeat: no-repeat; background-position: center;"></div>
            <div style="background-image: url('./img/woman.svg'); background-size: contain; background-repeat: no-repeat; background-position: center;"></div>
        </Carousel>

        {#if playable}
            {#if !isPlaying}
                <i style="position:absolute;" class="fa fa-play" on:click="{_ => playButtonClicked()}"></i>
            {:else}
                <i style="position:absolute;" class="fa fa-pause" on:click="{_ => playButtonClicked()}"></i>
            {/if}
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
        transition: 1s;
    }

    .fa {
        font-size: 38px;
        cursor: pointer;
        /*box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;*/
        filter: drop-shadow(0 1px 2px grey);
    }

    .banner-img {
        background-position: center;
        background-size: cover;
    }

    .carousel {
        height: 100%;
        background: white;
    }

</style>