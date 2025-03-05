import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TextService {
  capitalize(word: string): string {
    let result = word.charAt(0).toUpperCase();

    for (let i = 1; i < word.length; i++) {
      let char = word.charAt(i);

      if (char !== char.toUpperCase()) {
        result += word.charAt(i);
      } else {
        result += ' ' + char;
      }
    }

    return result;
  }

  joinToString(array: string[], separator: string = "\n"): string {
    return array.join(separator);
  }
}
