import * as cheerio from 'cheerio';
import {execSync} from 'node:child_process';
import {randomUUID} from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';

export class HtmlService {
  public static beautifyTable(html: string): string {
    const hasDoctype = /^<!doctype html>/i.test(html.trim());

    if (!hasDoctype) {
      html = "<!DOCTYPE html>" + html;
    }

    const $ = cheerio.load(html);

    const table = $("table");

    if (!table.length) {
      throw new Error("No table found in html.");
    }

    table
      .find("*")
      .removeAttr("class")
      .removeAttr("style")
      .removeAttr("border");

    table.wrap("<div class='bg-stone-200 w-fit p-4'></div>");
    table.addClass("table-auto w-full rounded-md shadow-lg border-separate border-spacing-y-1");

    $("tr").addClass("bg-white hover:bg-zinc-100 rounded-md")
    $("tr:first").addClass("border-zinc-300 border-b-2");

    $("th").addClass("w-fit px-4 py-2 text-left text-zinc-700 font-semibold hover:bg-zinc-200");

    $("td")
      .addClass("px-4 py-2 text-zinc-700 hover:bg-zinc-200")
      .each((_, td) => {
        const value = $(td).text().trim();

        if (!isNaN(Number(value))) {
          $(td).addClass("text-right");
        }
      });

    return $.html();
  }

  public static insertTailwind(html: string): string {
    const uniqueId = randomUUID().toString();
    const tempDir = "tmp";
    const inputHtmlPath = path.join(tempDir, `${uniqueId}.input.html`);
    const inputCssPath = path.join(tempDir, `${uniqueId}.input.css`);
    const outputCssPath = path.join(tempDir, `${uniqueId}.output.css`);

    try {
      fs.mkdirSync(tempDir, {recursive: true});
      fs.writeFileSync(inputHtmlPath, html);
      fs.writeFileSync(inputCssPath, `@import "tailwindcss" source("../");`);

      execSync(`npx @tailwindcss/cli -i "${inputCssPath}" -o "${outputCssPath}" --minify`);

      const css = fs.readFileSync(outputCssPath, "utf8");
      const $ = cheerio.load(html);

      $('head').append(`<style>${css}</style>`);

      return $.html();
    } finally {
      fs.rmSync(inputHtmlPath, {force: true});
      fs.rmSync(inputCssPath, {force: true});
      fs.rmSync(outputCssPath, {force: true});
    }
  }
}
