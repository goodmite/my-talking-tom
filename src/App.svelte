<script>
    import Banner from "./Banner.svelte";
    import AppBody from "./AppBody.svelte";
    import Modes from "./Modes.svelte";
    import {createAudioContext, initAudio, saveAudio, toggleRecording} from "./audio";
    import {ERECORDING_STATE} from "./typing/recording-state";
    import {audio2} from "./audio2";
    import WaveForms from "./WaveForms.svelte";


    export let name;
    let mode = "baby";
    let blob = "";
    let playable = false;
    let RECORDING_STATE = ERECORDING_STATE.DEFAULT;
    let audio2Obj;
    let audioRecorder1;
    const audioToggleHandler = (arg = "start") => {
        if (!audio2Obj) {
            audio2Obj = audio2({
                messageContainer: document.querySelector('.js-message'),
                canvas: document.querySelector('.js-canvas'),
                recordButton: document.querySelector('.js-record'),
                playButton: document.querySelector('.js-play'),
                audioPlayer: document.querySelector('.js-audio'),
                playButtonIcon: document.querySelector('.js-play .fa'),
                stopRecordingCb: (blob) => {
                    sendRecToServer(blob);
                }
            }, (recorder, audioRecorder) => {
                audio2Obj.toggleRecording();
                audioRecorder1 = audioRecorder
            })
        } else {
            audio2Obj.toggleRecording();
            audioRecorder1.exportWAV(x => {
                const audio = document.getElementById('audio2');
                audio.src = x;
            });
        }
    }

    const initWavesurfer = () => {

    }


    const sendRecToServer = (blob) => {
        initWavesurfer();
        var fd = new FormData();
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
            url: 'http://localhost:5005/get_audio',
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
    }


    const changeMode = modeArg => {
        mode = modeArg
    }

</script>

<main class="container">
    <Banner img="{'./img/' + mode + '.svg'}" mode="{mode}" playable="{playable}" blob1="{blob}"/>
    <div class="app-body-comp-wrapper" style="display: flex; flex-direction: column; position: relative">
        <div class="recorder" style="position: absolute; top: 0">
            <div class="waveform">
                <canvas height="50" class="js-canvas waveform__canvas"></canvas>
            </div>
            <div class="toolbar" style="">
                <button class="js-record button button--record"><i class="fa fa-microphone" aria-hidden="true"></i>
                </button>
                <button class="js-play button button--play button--disabled"><i class="fa fa-play"
                                                                                aria-hidden="true"></i>
                </button>
                <audio id="audio2" src=""></audio>
                <audio class="js-audio audio audio--hidden" controls/>
            </div>
        </div>
        <WaveForms/>
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