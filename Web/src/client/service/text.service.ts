import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TextService {
  readonly capitalize = (word: string): string => {
    let result = word.charAt(0).toUpperCase();

    for (let i = 1; i < word.length; i++) {
      let char = word.charAt(i);

      if (char !== char.toUpperCase()) {
        result += word.charAt(i);
      } else if (char !== '.') {
        result += ' ' + char;
      } else if (i + 1 < word.length) {
        result += ' ' + word.charAt(i + 1).toUpperCase();
        i++;
      }
    }

    return result;
  }
}
