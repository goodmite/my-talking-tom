<script>

    import {ERECORDING_STATE} from "./typing/recording-state";

    export let recording;
    export let audioToggleHandler;
    const clickHandler = () => {
        if (recording === ERECORDING_STATE.RECORDING) {
            audioToggleHandler('stop');
        } else if (recording === ERECORDING_STATE.DEFAULT) {
            audioToggleHandler('start');
        }
    }

</script>

<div class="comp">
    <div class="recorder-container {recording === ERECORDING_STATE.RECORDING && 'c'}"
         title="tap and hold"
         on:mousedown={_ => clickHandler()} on:mouseup={_ => clickHandler()}>
        {#if recording === ERECORDING_STATE.RECORDING}
            <i class="fa fa-circle {recording === ERECORDING_STATE.RECORDING && 's'}"></i>
        {:else if recording === ERECORDING_STATE.API}
            <img style="width: 100%" src="./img/cogwheel.svg" alt=""/>
        {:else}
            <i class="fa fa-microphone"></i>
        {/if}
    </div>
    <a style="display: none" id="save" href="#"><img></a>
</div>

<style>
    .comp {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 250px;
    }

    .recorder-container {
        height: 140px;
        width: 140px;
        border-radius: 50%;
        background: white;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .fa {
        font-size: 50px;
        color: #0000ffa3;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    @media only screen and (max-width: 600px) {
        .recorder-container {
            width: 150px;
            height: 150px;
        }

        .fa {
            font-size: 60px;
        }
    }


    html {
        background: #ffffff;
        overflow: hidden;
    }

    #c {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -45px;
    }

    #o {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -67px;
        margin-top: -22px;
        z-index: 0;
    }

    .o2 {
        width: 130px;
        height: 130px;
        border-radius: 50%;
        cursor: pointer;
        float: left;
        border: 2px solid #ebebeb;
    }

    .s {
        width: 90px;
        height: 90px;
        border-radius: 50%;
        float: left;
    }

    .s:nth-child(1) {
        /*background: #33bbff;*/
        -webkit-animation: r0 1.2s 0s ease-out infinite;
        -moz-animation: r0 1.2s 0s ease-out infinite;
        animation: r0 1.2s 0s ease-out infinite;
    }

    @-webkit-keyframes r0 {
        0% {
            box-shadow: 0 0 0px 5px rgba(26, 179, 255, 0), 0 0 0px 0px #ffffff, 0 0 0px 0px rgba(26, 179, 255, 0);
        }
        10% {
            box-shadow: 0 0 0px 5px #1ab3ff, 0 0 12px 10px #ffffff, 0 0 12px 14px #1ab3ff;
        }
        100% {
            box-shadow: 0 0 0px 5px rgba(26, 179, 255, 0), 0 0 0px 40px #ffffff, 0 0 0px 40px rgba(26, 179, 255, 0);
        }
    }

    @-moz-keyframes r0 {
        0% {
            box-shadow: 0 0 0px 5px rgba(26, 179, 255, 0), 0 0 0px 0px #ffffff, 0 0 0px 0px rgba(26, 179, 255, 0);
        }
        10% {
            box-shadow: 0 0 0px 5px #1ab3ff, 0 0 12px 10px #ffffff, 0 0 12px 14px #1ab3ff;
        }
        100% {
            box-shadow: 0 0 0px 5px rgba(26, 179, 255, 0), 0 0 0px 40px #ffffff, 0 0 0px 40px rgba(26, 179, 255, 0);
        }
    }

    @keyframes r0 {
        0% {
            box-shadow: 0 0 0px 5px rgba(26, 179, 255, 0), 0 0 0px 0px #ffffff, 0 0 0px 0px rgba(26, 179, 255, 0);
        }
        10% {
            box-shadow: 0 0 0px 5px #1ab3ff, 0 0 12px 10px #ffffff, 0 0 12px 14px #1ab3ff;
        }
        100% {
            box-shadow: 0 0 0px 5px rgba(26, 179, 255, 0), 0 0 0px 40px #ffffff, 0 0 0px 40px rgba(26, 179, 255, 0);
        }
    }

    @-webkit-keyframes r20 {
        from {
            box-shadow: 0 0 0px 5px #ff1a1a, 0 0 12px 10px #ffffff, 0 0 12px 14px #ff1a1a;
        }
        to {
            box-shadow: 0 0 0px 5px rgba(255, 26, 26, 0), 0 0 4px 40px #ffffff, 0 0 4px 41px rgba(255, 26, 26, 0);
        }
    }

    @-moz-keyframes r20 {
        from {
            box-shadow: 0 0 0px 5px #ff1a1a, 0 0 12px 10px #ffffff, 0 0 12px 14px #ff1a1a;
        }
        to {
            box-shadow: 0 0 0px 5px rgba(255, 26, 26, 0), 0 0 4px 40px #ffffff, 0 0 4px 41px rgba(255, 26, 26, 0);
        }
    }

    @keyframes r20 {
        from {
            box-shadow: 0 0 0px 5px #ff1a1a, 0 0 12px 10px #ffffff, 0 0 12px 14px #ff1a1a;
        }
        to {
            box-shadow: 0 0 0px 5px rgba(255, 26, 26, 0), 0 0 4px 40px #ffffff, 0 0 4px 41px rgba(255, 26, 26, 0);
        }
    }

</style>