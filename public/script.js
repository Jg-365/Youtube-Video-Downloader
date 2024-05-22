async function fetchVideoInfo() {
  loading();
  let url = document.getElementById("url").value.trim(); // Use 'let' em vez de 'const'

  // Normalizar URLs de youtu.be para youtube.com/watch?v=VIDEO_ID
  if (url.includes("youtu.be")) {
    const videoId = url.split("/").pop().split("?")[0]; // Handle potential query parameters
    url = `https://www.youtube.com/watch?v=${videoId}`;
  } else if (url.includes("youtube.com") && url.includes("watch")) {
    // Ensure URL is well-formed for youtube.com
    const urlObj = new URL(url);
    const videoId = urlObj.searchParams.get("v");
    if (videoId) {
      url = `https://www.youtube.com/watch?v=${videoId}`;
    }
  }

  try {
    const response = await fetch(
      `https://youtube-video-downloader-pi.vercel.app/info?url=${encodeURIComponent(
        url
      )}`
    );
    const data = await response.json();

    if (response.ok) {
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
        const option = document.createElement("option");
        option.value = format.itag;
        option.innerText = `${format.quality} ${
          format.hasAudio ? "Video" : "Without Audio"
        }`;
        qualitySelect.appendChild(option);
      });
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Failed to fetch video info");
  }
}

document.getElementById("enter").addEventListener("click", fetchVideoInfo);
document.getElementById("url").addEventListener("input", fetchVideoInfo);
document.getElementById("url").addEventListener("paste", () => {
  setTimeout(fetchVideoInfo, 100); // Pequeno delay para garantir que o valor colado seja capturado
});
document.getElementById("url").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    fetchVideoInfo();
  }
});

function downloadVideo() {
  const url = document.getElementById("url").value.trim(); // Use 'let' em vez de 'const'
  const itag = document.getElementById("quality").value;

  // Normalizar URLs de youtu.be para youtube.com/watch?v=VIDEO_ID
  let normalizedUrl = url;
  if (url.includes("youtu.be")) {
    const videoId = url.split("/").pop().split("?")[0]; // Handle potential query parameters
    normalizedUrl = `https://www.youtube.com/watch?v=${videoId}`;
  } else if (url.includes("youtube.com") && url.includes("watch")) {
    // Ensure URL is well-formed for youtube.com
    const urlObj = new URL(url);
    const videoId = urlObj.searchParams.get("v");
    if (videoId) {
      normalizedUrl = `https://www.youtube.com/watch?v=${videoId}`;
    }
  }

  window.location.href = `https://youtube-video-downloader-pi.vercel.app/download?url=${encodeURIComponent(
    normalizedUrl
  )}&itag=${itag}`;
}

document.getElementById("enter").addEventListener("click", fetchVideoInfo);

document.getElementById("url").addEventListener("input", fetchVideoInfo);

document.getElementById("url").addEventListener("paste", () => {
  setTimeout(fetchVideoInfo, 100); // Pequeno delay para garantir que o valor colado seja capturado
});

document.getElementById("url").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    fetchVideoInfo();
  }
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
