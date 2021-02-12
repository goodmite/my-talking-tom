<script>
    export let blob1 = "";
    function log(x){
        console.log(x);
    }
</script>

<div class="banner-comp"
     style="    background-image: url({'https://i.pinimg.com/originals/8e/58/90/8e5890347df2ecbf52aae943981c6b41.png'});
    height: 40%;">

    <div on:click="{log(blob1)}">
        <audio controls  src="{blob1}" id="audio"></audio>
    </div>

</div>

<style>

    .banner-comp {
        background-position: center;
        background-size: cover;
    }

</style>