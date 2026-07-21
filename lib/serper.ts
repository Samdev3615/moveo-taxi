type SerperResult = {
  title: string;
  link: string;
  snippet: string;
  position: number;
};

type SerperResponse = {
  organic?: SerperResult[];
  answerBox?: { answer?: string; snippet?: string };
  peopleAlsoAsk?: { question: string; snippet: string }[];
};

export async function serperSearch(
  query: string,
  options: { gl?: string; hl?: string; num?: number } = {}
): Promise<SerperResponse> {
  const res = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "X-API-KEY": process.env.SERPER_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: query,
      gl: options.gl ?? "il",
      hl: options.hl ?? "en",
      num: options.num ?? 5,
    }),
  });

  if (!res.ok) throw new Error(`Serper error: ${res.status}`);
  return res.json();
}

export function formatResults(data: SerperResponse): string {
  const lines: string[] = [];

  if (data.answerBox?.snippet) {
    lines.push(`Featured snippet: ${data.answerBox.snippet}`);
  }

  (data.organic ?? []).forEach((r, i) => {
    lines.push(`${i + 1}. [${r.title}](${r.link})\n   ${r.snippet}`);
  });

  if (data.peopleAlsoAsk?.length) {
    lines.push("\nPeople also ask:");
    data.peopleAlsoAsk.slice(0, 3).forEach((q) => {
      lines.push(`- ${q.question}`);
    });
  }

  return lines.join("\n");
}
