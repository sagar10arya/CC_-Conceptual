import axios from "axios";

const getInstagramPhotos = async (req, res) => {
  try {
    // console.log("📢 Instagram API Request Received!");

    const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
    if (!INSTAGRAM_ACCESS_TOKEN) {
      return res.status(500).json({ error: "Missing Instagram Access Token" });
    }

    const response = await axios.get(
      `https://graph.instagram.com/me/media?fields=id,media_type,media_url,caption&access_token=${INSTAGRAM_ACCESS_TOKEN}`
    );

    // console.log("✅ Instagram API Response:", response.data); // Log response
    res.json(response.data);
  } catch (error) {
    console.error(
      "❌ Instagram API Error:",
      error.response?.data || error.message
    );

    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
      return res.status(500).json({ error: "No response from Instagram API" });
    } else {
      return res.status(500).json({ error: "Unexpected server error" });
    }
  }
};

export default getInstagramPhotos;