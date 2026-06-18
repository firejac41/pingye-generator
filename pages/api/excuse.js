import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const ipMap = {};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const today = new Date().toISOString().slice(0, 10);
    const key = `${ip}_${today}`;

    if (!ipMap[key]) ipMap[key] = 0;
    if (ipMap[key] >= 10) {
      return res.status(429).json({ error: "오늘 사용 횟수(10회)를 초과했어요 😢 내일 다시 와주세요!" });
    }
    ipMap[key]++;

    const { situation, target, style, kakao } = req.body;

    const kakaoInstruction = kakao
      ? `반드시 카톡 말투로 작성해. ㅠㅠ, ㅋㅋ, 축약어, 이모티콘 등을 자연스럽게 섞어서 실제 카톡에서 보낼 수 있는 말투로 써줘.`
      : `격식체나 일반 말투로 작성해.`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: `너는 핑계 전문 작가야. 사용자가 상황을 알려주면 그럴듯한 핑계 3가지를 JSON 형식으로만 반환해.
반드시 아래 형식으로만 응답하고, 마크다운 코드블록이나 다른 텍스트는 절대 포함하지 마.
{"excuses": [{"title": "핵심 한줄 요약", "text": "실제로 쓸 핑계 문장 (2~3문장)", "tip": "이 핑계 사용 팁 한줄"}]}
핑계는 너무 뻔하지 않고 창의적이면서도 실제로 쓸 수 있어야 해.
${kakaoInstruction}`,
      messages: [{ role: "user", content: `상황: ${situation}\n대상: ${target}\n스타일: ${style}` }],
    });

    const text = message.content[0].text;
    const parsed = JSON.parse(text);
    res.status(200).json(parsed);

  } catch (e) {
    console.error("오류 내용:", e.message);
    res.status(500).json({ error: e.message });
  }
}