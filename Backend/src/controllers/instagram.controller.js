    import axios from "axios";

    const getInstagramPhotos = async (req, res) => {
        // console.log("📢 Instagram API Request Received!");
    try {
        const response = await axios.get(
        `https://graph.instagram.com/me/media?fields=id,media_type,media_url,caption&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`
        );
        // console.log("📢 Instagram API Response:", response.data);
        res.json(response.data); // ✅ Send JSON response
    } catch (error) {
        console.error("❌ Instagram API Error:", error.response?.data || error);
        res.status(500).json({ error: "Failed to fetch Instagram photos" });
    }
    };

    export default getInstagramPhotos;