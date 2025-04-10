import * as cheerio from 'cheerio';

export class HtmlService {
  public static beautifyTable(html: string): string {
    const $ = cheerio.load(html);

    const table = $("table");

    if (!table.length) {
      throw new Error("No table found in html.");
    }

    table.wrap("<div class='bg-zinc-200 w-fit p-4 rounded-md shadow-md'></div>");

    table.addClass("table-auto w-full border-separate border-spacing-y-1").removeAttr("border");

    $("tr").addClass("bg-white hover:bg-zinc-100 rounded-lg")
    $("tr:first").addClass("border-zinc-300 border-b-2");

    $("th").addClass("w-fit px-4 py-2 text-left text-zinc-700 font-semibold");
    $("th:not(:last-child)").addClass("border-r-2 border-zinc-200");

    $("td").addClass("px-4 py-2 text-zinc-700 hover:bg-zinc-200").each((_, td) => {
      const value = $(td).text().trim();

      if (!isNaN(Number(value))) {
        $(td).addClass("text-right");
      }
    });

    return $.html();
  }

  public static insertTailwind(html: string): string {
    const $ = cheerio.load(html);

    $("head").append(`<script src="https://cdn.tailwindcss.com"></script>`);

    return $.html();
  }
}
