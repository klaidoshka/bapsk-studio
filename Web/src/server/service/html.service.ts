import * as cheerio from 'cheerio';

export class HtmlService {
  public static beautifyHtml(html: string): string | undefined {
    const $ = cheerio.load(html);

    const table = $("table");

    table.wrap("<div class='bg-gray-200 w-fit p-4 rounded-md shadow-md'></div>");

    table.addClass("table-auto w-full border-separate border-spacing-y-1").removeAttr("border");

    $("tr").addClass("bg-white hover:bg-gray-100 rounded-lg")
    $("tr:first").addClass("border-gray-300 border-b-2");

    $("th").addClass("w-fit px-4 py-2 text-left text-gray-700 font-semibold");
    $("th:not(:last-child)").addClass("border-r-2 border-gray-200");

    $("td").addClass("px-4 py-2 text-gray-700").each((_, td) => {
      const value = $(td).text().trim();

      if (!isNaN(Number(value))) {
        $(td).addClass("text-right");
      }
    });

    $("td:not(:last-child)").addClass("border-r-2 border-gray-200");

    return $.html();
  }

  public static insertTailwind(html: string): string | undefined {
    // const uniqueId = randomUUID().toString();
    // const tempDir = "tmp";
    // const inputHtmlPath = path.join(tempDir, `${uniqueId}.input.html`);
    // const inputCssPath = path.join(tempDir, `${uniqueId}.input.css`);
    // const outputCssPath = path.join(tempDir, `${uniqueId}.output.css`);

    try {
      // fs.mkdirSync(tempDir, {recursive: true});
      // fs.writeFileSync(inputHtmlPath, html);
      //
      // fs.writeFileSync(inputCssPath, `
      //   @import "tailwindcss" source(none);
      //   @source "${inputHtmlPath}";
      // `);
      //
      // execSync(`npx @tailwindcss/cli -i "${inputCssPath}" -o "${outputCssPath}" --content "${inputHtmlPath}"`);
      //
      // const css = fs.readFileSync(outputCssPath, "utf8");
      const $ = cheerio.load(html);

      // $('head').append(`<style>${css}</style>`);
      $("head").append(`<script src="https://cdn.tailwindcss.com"></script>`);

      return $.html();
    } catch (e) {
      console.error("Failed beautifying HTML.", e);
      return undefined;
    } finally {
      // fs.rmSync(inputHtmlPath, {force: true});
      // fs.rmSync(inputCssPath, {force: true});
      // fs.rmSync(outputCssPath, {force: true});
    }
  }
}
