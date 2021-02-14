<script>
    import Banner from "./Banner.svelte";
    import AppBody from "./AppBody.svelte";
    import Modes from "./Modes.svelte";
    import {createAudioContext, initAudio, saveAudio, toggleRecording} from "./audio";

    export let name;
    let mode = "baby";
    let blob = "";
    let recording = false;
    const audioToggleHandler = () => {
        recording = true;
        createAudioContext();
        initAudio();
        setTimeout(() => {
            toggleRecording(recording);
            setTimeout(() => {
                saveAudio(_ => alert())
                    .then((blob) => {
                        var fd = new FormData();
                        debugger;
                        fd.append('file', blob, 'filename.wav');
                        fd.append('mode', mode);
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
                            recording = false;
                            //
                            // recordedAudio.controls = true;
                            //
                            // audioDownload.href = recordedAudio.src;
                            // audioDownload.download = 'filename.wav';
                            // audioDownload.innerHTML = 'Download';

                        }).fail(() => {
                            recording = false;
                        })
                    })
            }, 3000);
        }, 2000)
    }


    const changeMode = modeArg => {
        mode = modeArg
    }

</script>

<main class="container">

    <Banner img="{'./img/' + mode + '.svg'}" blob1="{blob}"/>
    <div class="app-body-comp-wrapper">
        <AppBody recording="{recording}" audioToggleHandler="{audioToggleHandler}"/>
    </div>
<!--    <div class="mode-comp-wrapper">-->
        <Modes changeModeFn="{changeMode}" mode="{mode}"/>
<!--    </div>-->

</main>

<style>
    .container {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 50vh;
        height: 90vh;
        background: wheat;
        border-radius: 16px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    @media only screen and (max-width: 600px) {
        .container {
            width: 100vw;
            height: 100vh;
            border-radius: 0px;
        }
    }

    .app-body-comp-wrapper{
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .mode-comp-wrapper{
        flex-grow: 1;
    }

</style>