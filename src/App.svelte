<script>
    import Banner from "./Banner.svelte";
    import AppBody from "./AppBody.svelte";
    import Modes from "./Modes.svelte";
    import {createAudioContext, initAudio, saveAudio, toggleRecording} from "./audio";

    export let name;
    const mode = "baby";
    let blob = "";
    let recording = false;
    const audioToggleHandler = () => {
        createAudioContext();
        initAudio();
        setTimeout(() => {
            toggleRecording(recording);
            recording = !recording;
            setTimeout(() => {
                saveAudio(_ => alert())
                    .then((blob) => {
                        var fd = new FormData();
                        debugger;
                        fd.append('file', blob, 'filename.wav');
                        // fd.append('mode', mode);
                        window.jQuery.ajax({
                            type: 'POST',
                            url: 'https://sheltered-plateau-08459.herokuapp.com/get_audio',
                            data: fd,
                            cache: false,
                            processData: false,
                            contentType: false,
                            enctype: 'multipart/form-data'
                        }).done(function (data) {
                            const resp = data["data"]
                            blob = "data:audio/wav;base64, " + resp//URL.createObjectURL(data);
							document.getElementById('audio').src = blob;
                            //
                            // recordedAudio.controls = true;
                            //
                            // audioDownload.href = recordedAudio.src;
                            // audioDownload.download = 'filename.wav';
                            // audioDownload.innerHTML = 'Download';

                        });
                    })
            }, 3000);
        }, 2000)
    }

</script>

<main class="container">

    <Banner blob1="{blob}"/>
	<audio controls  src="{blob}" id="audio"></audio>
    <AppBody audioToggleHandler="{audioToggleHandler}"/>
    <Modes/>

</main>

<style>
    .container {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 50vh;
        height: 90vh;
        background: red;
        border-radius: 16px;
        overflow: hidden;
    }

</style>