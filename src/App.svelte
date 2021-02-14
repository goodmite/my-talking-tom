<script>
    import Banner from "./Banner.svelte";
    import AppBody from "./AppBody.svelte";
    import Modes from "./Modes.svelte";
    import {createAudioContext, initAudio, saveAudio, toggleRecording} from "./audio";
    import {ERECORDING_STATE} from "./typing/recording-state";


    export let name;
    let mode = "baby";
    let blob = "";
    let playable = false;
    let RECORDING_STATE = ERECORDING_STATE.DEFAULT;
    const audioToggleHandler = (arg = "start") => {
        if (arg === "start") {
            RECORDING_STATE = ERECORDING_STATE.RECORDING;
            createAudioContext();
            initAudio();
            setTimeout(()=>{
                toggleRecording(false);
            }, 500)
        } else {
            setTimeout(() => {
                setTimeout(() => {
                    saveAudio(_ => alert())
                        .then((blob) => {
                            var fd = new FormData();
                            RECORDING_STATE = ERECORDING_STATE.API;
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
                                playable = true;
                                const audio = document.getElementById('audio');
                                audio.src = blob;
                                audio.play();
                                RECORDING_STATE = ERECORDING_STATE.DEFAULT;
                                //
                                // recordedAudio.controls = true;
                                //
                                // audioDownload.href = recordedAudio.src;
                                // audioDownload.download = 'filename.wav';
                                // audioDownload.innerHTML = 'Download';

                            }).fail(() => {
                                RECORDING_STATE = ERECORDING_STATE.DEFAULT;
                            })
                        })
                });
            })
        }
    }


    const changeMode = modeArg => {
        mode = modeArg
    }

</script>

<main class="container">

    <Banner img="{'./img/' + mode + '.svg'}" mode="{mode}" playable="{playable}" blob1="{blob}"/>
    <div class="app-body-comp-wrapper">
        <AppBody recording="{RECORDING_STATE}" audioToggleHandler="{audioToggleHandler}"/>
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

    .app-body-comp-wrapper {
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .mode-comp-wrapper {
        flex-grow: 1;
    }

</style>