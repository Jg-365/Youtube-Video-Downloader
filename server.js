const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");
const path = require("path");
const http = require("http");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.static(path.join(__dirname, "/public")));

app.get("/info", async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const info = await ytdl.getInfo(url);
    const formats = info.formats
      .filter((format) => ["mp4", "webm"].includes(format.container))
      .map((format) => ({
        quality: format.qualityLabel,
        itag: format.itag,
        container: format.container,
        hasAudio: format.hasAudio,
      }));
    const videoDetails = {
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails.pop().url,
      formats: formats,
    };
    res.json(videoDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/download", (req, res) => {
  const url = req.query.url;
  const itag = req.query.itag;

  if (!url || !itag) {
    return res.status(400).json({ error: "URL and itag are required" });
  }

  res.header("Content-Disposition", `attachment; filename="videos.mp4"`);
  ytdl(url, { filter: (format) => format.itag == itag }).pipe(res);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
