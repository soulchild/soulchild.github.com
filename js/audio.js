let source;
let audioBuffer;

async function fetchAudioBuffer() {
  if (!audioBuffer) {
    const arrayBuffer = await fetch("/audio/funkreich.ogg").then((res) =>
      res.arrayBuffer()
    );
    const audioCtx = new window.AudioContext();
    audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    audioCtx.close();
  }
  return audioBuffer;
}

export async function toggleAudio() {
  document.getElementById("paused").classList.toggle("hidden");
  document.getElementById("playing").classList.toggle("hidden");

  const audioBuffer = await fetchAudioBuffer();

  if (source) {
    source.stop();
  } else {
    let audioCtx = new window.AudioContext();
    source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = true;
    source.connect(audioCtx.destination);
    source.onended = () => {
      source.disconnect();
      source = null;
      if (audioCtx) {
        audioCtx.close();
        audioCtx = null;
      }
    };
    source.start();
  }
}
