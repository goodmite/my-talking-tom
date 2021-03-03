<script>
    import App from "./App.svelte";

    let init = false

</script>

<div>
    {#if init }
        <App/>
    {:else }
        <button on:click="{ _ => init = true}">Start</button>
    {/if}
</div>

