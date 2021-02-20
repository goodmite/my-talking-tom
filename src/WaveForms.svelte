<script>
    import {onMount} from "svelte";

    let waveform, wavesurfer;
    export let button, blob;
    let initDone = false;
    export let seekTo;
    export let seekToChangedCb;
    export let postInitCbs = [];

    const init = () => {
        wavesurfer = WaveSurfer.create({
            container: waveform,
            waveColor: 'white',
            progressColor: '#4353FF',
            cursorColor: '#4353FF',
            barWidth: 3,
            barRadius: 3,
            cursorWidth: 1,
            height: 100,
            barGap: 1,
            autoCenter: true,
            scrollParent: true,
            minPxPerSec: 50,
        });
        wavesurfer.on('seek', function (data) {
            seekToChangedCb(data);
            seekTo = data;
        })
    }

    export const playPause = () => {
        if (initDone) {
            setTimeout(() => {

                wavesurfer.playPause();
            }, 0)
        } else {
            postInitCbs.push(() => {
                wavesurfer.playPause();
            })
        }
    }

    $:{
        if (blob && wavesurfer && !initDone) {
            console.log("hello1111111111");
            initDone = true;
            wavesurfer.load(blob);
            wavesurfer.toggleMute();
            postInitCbs.forEach((cb) => {
                setTimeout(() => {
                    cb();
                })
            })
        }
    }

    onMount(() => {
        init();
    })

    $:{
        if (seekTo && wavesurfer) {
            wavesurfer.seekTo(seekTo);
        }
    }

</script>
<div bind:this={waveform}></div>
<style>


</style>
<svelte:options accessors/>