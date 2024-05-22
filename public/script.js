async function fetchVideoInfo() {
  //Animação de Login
  loading();
  //Pega o elemento input
  let url = document.getElementById("url").value;

  if (url.includes("youtu.be")) {
    const videoId = url.split("/").pop().split("?")[0]; // Handle potential query parameters
    url = `https://www.youtube.com/watch?v=${videoId}`;
  } else if (url.includes("youtube.com")) {
    // Remove query parameters other than v
    const urlObj = new URL(url);
    const videoId = urlObj.searchParams.get("v");
    url = `https://www.youtube.com/watch?v=${videoId}`;
  }

  //Abre um bloco try-catch para caso de erro ao dar procurar as informações do video.
  try {
    //Declara uma constante response que recebe uma função fetch para receber um JSON do video.
    const response = await fetch(
      `http://192.168.11.198:3000/info?url=${encodeURIComponent(url)}`
    );
    //Declara uma constante data que recebe as informações do JSON.
    const data = await response.json();

    if (response.ok) {
      //Estilização com animações dinâmicas.
      stopLoading();
      document.getElementById("video-info").style.display = "flex";
      document.getElementById("video-info").style.flexDirection = "column";
      document.getElementById("video-info").style.justifyContent = "center";
      document.getElementById("video-info").style.alignItems = "center";

      //Escreve na tela o texto resumido a 60 caracteres do JSON data.title.
      document.getElementById("title").innerText = showSummarizedText(
        data.title
      );
      //Coloca uma imagem dinamicamente na tela extraindo-a diretamente do JSON.
      document.getElementById("thumbnail").src = data.thumbnail;

      //Declara uma constante que vai pegar o elemento select do HTML.
      const qualitySelect = document.getElementById("quality");

      //Certifica de que o corpo do elemento está vazio igualando a "".
      qualitySelect.innerHTML = "";

      //Abre um foreach percorrendo os formatos do JSON data.
      data.formats.forEach((format) => {
        //Se o formato compreender mp4 ou webm...
        if (["mp4", "webm"].includes(format.container)) {
          //...será criada uma nova opção por meio de um createElement().
          const option = document.createElement("option");
          //Nessa opção o valor de formato colocado vai depender do formato que está especificado.
          option.value = format.itag;
          //Aqui será escrito dinamicamente a qualidade do formato pelo JS e se tiver áudio coloca-se 'com áudio', se não, 'sem áudio'.
          option.innerText = `${format.quality} ${
            format.hasAudio ? "com áudio" : "sem áudio"
          }`;
          //E no fim mais uma opção é colocada ao final da lista.
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
}

function downloadVideo() {
  //Aqui é retirado o link copiado.
  const url = document.getElementById("url").value;
  //É retirado aqui a qualidade escolhida.
  const itag = document.getElementById("quality").value;
  //É feita uma requisição direta para a pasta de download
  if (url.includes("youtu.be")) {
    const videoId = url.split("/").pop().split("?")[0]; // Handle potential query parameters
    url = `https://www.youtube.com/watch?v=${videoId}`;
  } else if (url.includes("youtube.com")) {
    // Remove query parameters other than v
    const urlObj = new URL(url);
    const videoId = urlObj.searchParams.get("v");
    url = `https://www.youtube.com/watch?v=${videoId}`;
  }
  window.location.href = `http://192.168.11.198:3000/download?url=${encodeURIComponent(
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

document.getElementById("url").addEventListener("input", () => {
  fetchVideoInfo();
});

document.getElementById("url").addEventListener("paste", () => {
  setTimeout(() => fetchVideoInfo(), 100); // Pequeno delay para garantir que o valor colado seja capturado
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
