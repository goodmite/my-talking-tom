// adapted from https://github.com/Jam3/voice-activity-detection/blob/master/test/test.js

import xs from "xstream";
import vad from "@mjyc/voice-activity-detection"
//console.log(vad);
debugger;

export default function makeVoiceActivityDetectionDriver(options) {
    var audioContext;

    return function voiceActivityDetectionDriver() {
        return xs.create({
            start: listener => {
                function handleUserMediaError() {
                    listener.error("Mic input is not supported by the browser.");
                }

                function handleMicConnectError() {
                    listener.error(
                        "Could not connect microphone. Possible rejected by the user or is blocked by the browser."
                    );
                }

                function requestMic() {
                    try {
                        window.AudioContext =
                            window.AudioContext || window.webkitAudioContext;
                        audioContext = new AudioContext();
                        // https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#audiovideo_elements
                        if (audioContext.state === "suspended") {
                            console.warn(
                                `audioContext.state is "suspended"; will attempt to resume every 1s`
                            );
                            const handle = setInterval(() => {
                                if (!!audioContext && audioContext.state === "suspended") {
                                    audioContext.resume();
                                } else if (audioContext.state === "running") {
                                    console.debug(
                                        `audioContext.state is "running"; stopping resuming attempts`
                                    );
                                    clearInterval(handle);
                                }
                            }, 1000);
                        }

                        navigator.getUserMedia =
                            navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.msGetUserMedia;
                        navigator.getUserMedia(
                            {audio: true},
                            startUserMedia,
                            handleMicConnectError
                        );
                    } catch (e) {
                        handleUserMediaError();
                    }
                }

                function startUserMedia(stream) {
                    var opts = {
                        ...options,
                        useNoiseCapture: false,
                        activityCounterThresh: 10,
                        activityCounterMax: 30,
                        onVoiceStart: function () {
                            listener.next({
                                type: "START"
                            });
                        },
                        onVoiceStop: function () {
                            listener.next({
                                type: "STOP"
                            });
                        },
                        onUpdate: function (val) {
                            listener.next({
                                type: "UPDATE",
                                value: val
                            });
                        }
                    };
                    vad(audioContext, stream, opts);
                }

                requestMic();
            },
            stop: () => {
            }
        });
    };
}

export function adapter(output$, cb) {
    const state$ = output$
        .filter(({type}) => type === "START" || type === "STOP")
        .fold(
            (prev, {type}) => {
                let x = type === "START" ? "ACTIVE" : type === "STOP" ? "INACTIVE" : prev
                if (cb) {
                    cb(x);
                }
                return x;
            },
            "INACTIVE"
        );
    const level$ = output$
        .filter(({type}) => type === "UPDATE")
        .map(({value}) => value);
    return {
        events: name =>
            name === "state" ? state$ : name === "level" ? level$ : xs.never()
    };
}
