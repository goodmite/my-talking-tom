<script>

    import {onMount} from "svelte";

    let waveform;
    const init = () => {
        const wavesurfer = WaveSurfer.create({
            container: waveform,
            waveColor: 'violet',
            progressColor: 'purple'
        });
        wavesurfer.load('./audio/horse.ogg');
    }

    onMount(() => {
        init();
    })

</script>
<div bind:this={waveform}></div>
<style>


</style>