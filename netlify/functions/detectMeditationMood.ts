import { Handler } from "@netlify/functions";

const MEDITATIONS: Record<string, { video: string; audio: string }> = {
    happy: {
        video: "https://www.youtube.com/embed/1ZYbU82GVz4",
        audio: "https://www.youtube.com/embed/cEqZthCaMpo"
    },
    sad: {
        video: "https://www.youtube.com/embed/inpok4MKVLM",
        audio: "https://www.youtube.com/embed/z6X5oEIg6Ak"
    },
    angry: {
        video: "https://www.youtube.com/embed/MIr3RsUWrdo",
        audio: "https://www.youtube.com/embed/qQyQj2Fgi_k"
    },
    anxious: {
        video: "https://www.youtube.com/embed/sTANio_2E0Q",
        audio: "https://www.youtube.com/embed/GgP75HAvrlY"
    },
    neutral: {
        video: "https://www.youtube.com/embed/ZToicYcHIOU",
        audio: "https://www.youtube.com/embed/o-6f5wQXSu8"
    }
};

function detectMood(text: string): string {
    const t = text.toLowerCase();

    if (t.includes("angry") || t.includes("mad")) return "angry";
    if (t.includes("anxious") || t.includes("stress")) return "anxious";
    if (t.includes("sad") || t.includes("down")) return "sad";
    if (t.includes("happy") || t.includes("excited")) return "happy";

    return "neutral";
}

export const handler: Handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const body = JSON.parse(event.body || "{}");
    const text = body.text;

    if (!text) {
        return { statusCode: 400, body: JSON.stringify({ error: "Text required" }) };
    }

    const mood = detectMood(text);

    return {
        statusCode: 200,
        body: JSON.stringify({
            mood,
            video: MEDITATIONS[mood].video,
            audio: MEDITATIONS[mood].audio
        })
    };
};
