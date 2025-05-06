import {Component, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FileUpload} from 'primeng/fileupload';
import {ApiRouter} from '../../service/api-router.service';

@Component({
  selector: 'html-upload-for-overhaul',
  imports: [
    FileUpload
  ],
  templateUrl: './html-upload-for-overhaul.component.html',
  styles: ``
})
export class HtmlUploadForOverhaulComponent {
  private readonly apiRouter = inject(ApiRouter);
  private readonly httpClient = inject(HttpClient);

  protected onHtmlSelect(files: File[]) {
    if (files.length === 0) {
      return;
    }

    const file = files[0];

    if (file.type !== 'text/html') {
      alert('Please upload a valid HTML file.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {

      this.httpClient
        .post(this.apiRouter.misc.beautifyHtmlTable(), reader.result, {
          headers: {
            'Content-Type': 'text/html'
          },
          responseType: 'text'
        })
        .subscribe((result) => {
          const blob = new Blob([result as string], {type: 'text/html'});
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');

          a.href = url;
          a.download = file.name.replace(".html", "") + '.styled.html';
          a.style.display = 'none';

          document.body.appendChild(a);

          a.click();

          document.body.removeChild(a);

          URL.revokeObjectURL(url);
        });
    }

    reader.readAsText(file);
  }
}
