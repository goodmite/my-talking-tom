<script>
    import Banner from "./Banner.svelte";
    import AppBody from "./AppBody.svelte";
    import Modes from "./Modes.svelte";
    import {createAudioContext, initAudio, saveAudio, toggleRecording} from "./audio";
    import {ERECORDING_STATE} from "./typing/recording-state";
    import {audio2} from "./audio2";
    import WaveForms from "./WaveForms.svelte";
    import {init} from "./activity";


    export let name;
    let mode = "cat";
    let waveForms1, waveForms2;
    let button;
    let blob = "", blobInitial = "", blobFinal = "";
    let playable = false;
    let RECORDING_STATE = ERECORDING_STATE.DEFAULT;
    let audio2Obj;
    window._local = false;

    let id = Date.now();
    let socket = window.io("https://talking-tom.herokuapp.com", {query: {id}});
    // let socket = window.io("http://localhost:3000");
    const chunks = [];
    const setTimeoutList = [];
    let clientList = [];

    const audioPlayer = new Audio();

    function x(arr) {
        const currentTime = audioPlayer.currentTime;
        const blob = new Blob(arr, {'type': 'audio/wav'});
        const recording = URL.createObjectURL(blob);
        audioPlayer.setAttribute('src', recording);
        audioPlayer.currentTime = currentTime;
        audioPlayer.play();
    }

    socket.on('chat message', function ({data, timestamp}) {
        console.log((Date.now() - timestamp) / 1000 + " sec delay in this RECEIVING this packet");
        chunks.push(data);
        /*always play latest packet, ignore stale packets*/
        const ref = setTimeout(() => {
            setTimeoutList.forEach((item) => {
                clearTimeout(item);
            })
            setTimeoutList.length = 0;
            x(chunks);
        }, 0);
        setTimeoutList.push(ref);
    });
    socket.on('connect_done', function (data) {
        clientList = data.clients;
        console.log(data);
    })
    socket.on('disconnect_done', function (data) {
        clientList = data.clients;
        console.log(data);
    })
    socket.on('activity', function (data) {
        clientList = data.clients;
        console.log(data);
    })
    socket.on('stopped', function () {
        audioPlayer.pause();
    });
    let seekTo = 0;
    let view = "default";
    var seconds = 0;
    var el = document.getElementById('seconds-counter');
    let intervalRef;
    init((activity) => {
        socket.emit('activity', {activity, id});
    })

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
                    socket.emit('stopped', "bye");
                },
                dataReceived: (data) => {
                    const timestamp = Date.now();
                    socket.emit('chat message', {data, timestamp});
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
        return;
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
    let height = "";
    const getWidth = () => {
        height = document.body.getBoundingClientRect().height / clientList.length;
    }
    $:{
        try {
            if (clientList.length) {
                height = document.body.getBoundingClientRect().height / clientList.length - 10;
                height = Math.max(180, height);
            }
        } catch (e) {
            debugger;
        }
    }
</script>

<main class="container">
    <div class="toolbar" style="display: none">
        <button class="js-record button button--record"><i class="fa fa-microphone" aria-hidden="true"></i>
        </button>
        <button class="js-play button button--play button--disabled"><i class="fa fa-play"
                                                                        aria-hidden="true"></i>
        </button>
        <audio id="audio2" src=""></audio>
        <audio class="js-audio audio audio--hidden" controls/>
        <canvas class="js-canvas"></canvas>
    </div>

    {#each clientList as client}
        <div class="item {client.activity}" style="height: {height}px; width: {height}px; margin: 10px; flex-shrink: 0">
            <div class="circle" on:click={_ => audioToggleHandler()}>

            </div>
        </div>
    {/each}

</main>

<style>
    .container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-content: center;
        max-width: 660px;
    }

    .item {
        background: lightgrey;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .ACTIVE .circle {
        background: red;
    }

    .circle {
        height: 50%;
        width: 50%;
        border-radius: 50%;
        background: grey;
    }
</style>
