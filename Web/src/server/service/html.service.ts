import {execSync} from 'node:child_process';
import path from 'node:path';
import * as fs from 'node:fs';
import {randomUUID} from 'node:crypto';
import juice from 'juice';

export class HtmlService {
  public static beautifyHtml(html: string): string | undefined {
    const uniqueId = randomUUID().toString();
    const tempDir = path.join(process.cwd(), "temp");
    const inputHtmlPath = path.join(tempDir, `${uniqueId}.input.html`);
    const inputCssPath = path.join(tempDir, `${uniqueId}.input.css`);
    const outputCssPath = path.join(tempDir, `${uniqueId}.output.css`);

    try {
      fs.mkdirSync(tempDir, {recursive: true});

      fs.writeFileSync(inputHtmlPath, html);

      fs.writeFileSync(inputCssPath, `
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `);

      execSync(`npx tailwindcss -i ${inputCssPath} -o ${outputCssPath} --content ${inputHtmlPath}`);

      const css = fs.readFileSync(outputCssPath, "utf8");

      return juice.inlineContent(html, css);
    } catch (err) {
      console.error("Error when beautifying HTML", err);
      return undefined;
    } finally {
      fs.rmSync(inputHtmlPath, {force: true});
      fs.rmSync(inputCssPath, {force: true});
      fs.rmSync(outputCssPath, {force: true});
    }
  }
}
