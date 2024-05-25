async function fetchVideoInfo() {
  loading();
  var url = document.getElementById("url").value;
  if (url.includes("youtu.be")) {
    const yt1 = url.slice(0, 17);
    const yt2 = url.slice(17).split("?");
    const videoId = yt2[0];
    const newUrl = "https://youtube.com/watch?v=" + videoId;
    url = newUrl;
  }

  try {
    const response = await fetch(
      `https://youtube-video-downloader-lake.vercel.app/info?url=${encodeURIComponent(
        url
      )}`
    );

    const data = await response.json();
    console.log(response);

    if (response.ok) {
      console.log(url);
      stopLoading();
      document.getElementById("video-info").style.display = "flex";
      document.getElementById("video-info").style.flexDirection = "column";
      document.getElementById("video-info").style.justifyContent = "center";
      document.getElementById("video-info").style.alignItems = "center";

      document.getElementById("title").innerText = showSummarizedText(
        data.title
      );
      document.getElementById("thumbnail").src = data.thumbnail;

      const qualitySelect = document.getElementById("quality");
      qualitySelect.innerHTML = "";
      data.formats.forEach((format) => {
        if (["mp4", "webm"].includes(format.container)) {
          const option = document.createElement("option");
          option.value = format.itag;
          option.innerText = `${format.quality} ${
            format.hasAudio ? "com áudio" : "sem áudio"
          }`;
          qualitySelect.appendChild(option);
        }
      });
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Failed to fetch video info");
  }
  stopLoading();
}

function downloadVideo() {
  const url = document.getElementById("url").value;
  const itag = document.getElementById("quality").value;
  window.location.href = `https://youtube-video-downloader-lake.vercel.app/download?url=${encodeURIComponent(
    url
  )}&itag=${itag}`;
}

document.getElementById("enter").addEventListener("click", () => {
  const arrow = document.getElementById("arrow");
  arrow.classList.add("animate");

  setTimeout(() => {
    arrow.classList.remove("animate");
  }, 1000);
});

function loading() {
  const container = document.getElementById("downloader");
  const loading = document.getElementById("loading");
  downloader.style.opacity = "30%";
  downloader.style.cursor = "none";
  loading.style.display = "block";
  loading.classList.add("animate1");
}

function stopLoading() {
  const container = document.getElementById("downloader");
  const loading = document.getElementById("loading");
  downloader.style.opacity = "100%";
  downloader.style.cursor = "auto";
  loading.classList.remove("animate1");
  loading.style.display = "none";
}

window.onload = function clear() {
  url.value = "";
};

function showSummarizedText(str) {
  let newTitle = str;
  if (str.length > 60) {
    newTitle = str.substring(0, 50) + "...";
  }
  return newTitle;
}
