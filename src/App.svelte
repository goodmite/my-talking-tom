<script>
    import Banner from "./Banner.svelte";
    import AppBody from "./AppBody.svelte";
    import Modes from "./Modes.svelte";
    import {createAudioContext, initAudio, saveAudio, toggleRecording} from "./audio";
    import {ERECORDING_STATE} from "./typing/recording-state";
    import {audio2} from "./audio2";
    import WaveForms from "./WaveForms.svelte";


    export let name;
    let mode = "cat";
    let waveForms1, waveForms2;
    let button;
    let blob = "", blobInitial = "", blobFinal = "";
    let playable = false;
    let RECORDING_STATE = ERECORDING_STATE.DEFAULT;
    let audio2Obj;
    window._local = false;
    let seekTo = 0;
    let view = "default";
    var seconds = 0;
    var el = document.getElementById('seconds-counter');
    let intervalRef;

    function incrementSeconds() {
        seconds += 1;
    }

    const seekToChangedCb = (arg) => {
        seekTo = arg;
        setTimeout(() => {
            const audio = document.getElementById('audio');
            audio.currentTime = arg * audio.duration;
        })
        // audio.play();
    }
    const audioToggleHandler1 = () => {
        if (!audio2Obj) {
            intervalRef = setInterval(incrementSeconds, 1000);
            audio2Obj = audio2({
                messageContainer: document.querySelector('.js-message'),
                canvas: document.querySelector('.js-canvas'),
                recordButton: document.querySelector('.js-record'),
                playButton: document.querySelector('.js-play'),
                audioPlayer: document.querySelector('.js-audio'),
                playButtonIcon: document.querySelector('.js-play .fa'),
                stopRecordingCb: (blob) => {

                }
            }, (recorder, audioRecorder) => {
                audio2Obj.toggleRecording();
            })
        } else {
            audio2Obj.toggleRecording();
            audio2Obj = null;
            clearInterval(intervalRef);
            seconds = 0;
        }
    }

    const audioToggleHandler = (arg = "start") => {
        audioToggleHandler1();
        if (arg === "start") {
            RECORDING_STATE = ERECORDING_STATE.RECORDING;
            createAudioContext();
            initAudio();
            setTimeout(() => {
                toggleRecording(false);
            }, 1000)
        } else {
            setTimeout(() => {
                setTimeout(() => {
                    saveAudio(_ => alert())
                        .then((blob) => {
                            console.log(blob);
                            const reader = new FileReader();
                            reader.readAsDataURL(blob);
                            reader.onloadend = function () {
                                blobInitial = reader.result;
                            }
                            const fd = new FormData();
                            RECORDING_STATE = ERECORDING_STATE.API;
                            let tempMode = mode;
                            if (mode === "man") {
                                tempMode = "male";
                            }
                            if (mode === "woman") {
                                tempMode = "female";
                            }

                            fd.append('file', blob, 'filename.wav');
                            fd.append('mode', tempMode);
                            window.jQuery.ajax({
                                type: 'POST',
                                url: window._local ? 'http://localhost:5005/get_audio' : 'https://ancient-meadow-88825.herokuapp.com/get_audio',
                                data: fd,
                                cache: false,
                                processData: false,
                                contentType: false,
                                enctype: 'multipart/form-data'
                            }).done(function (data) {
                                const resp = data["data"]
                                blobFinal = "data:audio/wav;base64, " + resp//URL.createObjectURL(data);
                                playable = true;
                                const audio = document.getElementById('audio');
                                audio.src = blobFinal;
                                viewChangeHandler("waveform");
                                setTimeout(() => {
                                    audio.play();
                                    waveForms1.playPause();
                                    waveForms2.playPause();
                                }, 1000)

                                setTimeout(() => {
                                    console.log(button);
                                    button.click();
                                }, 1000);
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

    const playButtonClickedCb = (isPlaying) => {
        waveForms1.playPause();
        waveForms2.playPause();
    }

    const viewChangeHandler = (arg) => {
        view = arg;
        if (view === 'default') {
            playable = false
            const audio = document.getElementById('audio');
            audio.pause();
        }
    }
</script>

<main class="container">
    <button style="display: none" bind:this={button}>hello</button>
    <Banner playButtonClickedCb="{playButtonClickedCb}"
            seconds="{seconds}"
            button="{button}" img="{'./img/' + mode + '.svg'}" mode="{mode}"
            playable="{playable}" blob1="{blob}">
    </Banner>

    <div class="app-body-comp-wrapper" style="display: flex; flex-direction: column; position: relative">
        {#if view === 'waveform'}
            <div style="width: 100%">
                <div style="display: flex;justify-content: flex-end;">
                    <i on:click="{_ => { viewChangeHandler('default')}}"
                       style="padding: 8px; color: blue; cursor: pointer; opacity: 0.8"
                       class="fa fa-times"></i>
                </div>
                <div style="width: 100%; height: 100px; display: flex; flex-direction: column; justify-content: center">
                    <WaveForms bind:seekTo={seekTo} seekToChangedCb="{seekToChangedCb}" bind:this={waveForms1}
                               blob="{blobInitial}"
                               button="{button}"/>
                </div>
                <div style="width: 100%; height: 100px; display: flex; flex-direction: column; justify-content: center">
                    <WaveForms bind:seekTo={seekTo} seekToChangedCb="{seekToChangedCb}" bind:this={waveForms2}
                               blob="{blobFinal}"
                               button="{button}"/>
                </div>
            </div>
        {/if}
        <div class="recorder" style="position: absolute; top: 0">
            {#if view === "default"}
                <div class="waveform" style="z-index: -1">
                    <canvas height="50" class="js-canvas waveform__canvas"></canvas>
                </div>
            {/if}
            <div class="toolbar" style="display: none">
                <button class="js-record button button--record"><i class="fa fa-microphone" aria-hidden="true"></i>
                </button>
                <button class="js-play button button--play button--disabled"><i class="fa fa-play"
                                                                                aria-hidden="true"></i>
                </button>
                <audio id="audio2" src=""></audio>
                <audio class="js-audio audio audio--hidden" controls/>
            </div>
        </div>

        {#if view === "default"}
            <AppBody recording="{RECORDING_STATE}" audioToggleHandler="{audioToggleHandler}"/>
        {/if}
    </div>
    <!--    <div class="mode-comp-wrapper">-->
    {#if view === "default"}
        <Modes changeModeFn="{changeMode}" mode="{mode}"/>
    {/if}
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

    .d-none {
        visibility: hidden !important;
    }

</style>
