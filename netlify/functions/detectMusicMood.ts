import { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
    const PLAYLISTS: Record<string, string> = {
        happy: "https://open.spotify.com/embed/playlist/37i9dQZF1DXdPec7aLTmlC",
        sad: "https://open.spotify.com/embed/playlist/37i9dQZF1DX7qK8ma5wgG1",
        angry: "https://open.spotify.com/embed/playlist/37i9dQZF1DWYxwmBaMqxsl",
        anxious: "https://open.spotify.com/embed/playlist/37i9dQZF1DWXe9gFZP0gtP",
        neutral: "https://open.spotify.com/embed/playlist/37i9dQZF1DX3rxVfibe1L0"
    };

    const body = JSON.parse(event.body || "{}");
    const text = (body.text || "").toLowerCase();

    let mood = "neutral";
    if (text.includes("happy")) mood = "happy";
    else if (text.includes("sad")) mood = "sad";
    else if (text.includes("angry")) mood = "angry";
    else if (text.includes("stress") || text.includes("anxious")) mood = "anxious";

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
            mood,
            playlist: PLAYLISTS[mood]
        })
    };
};
