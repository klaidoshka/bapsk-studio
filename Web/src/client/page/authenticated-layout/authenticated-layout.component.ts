import {Component, inject, signal} from "@angular/core";
import {RouterModule} from "@angular/router";
import {AuthService} from '../../service/auth.service';
import {NgIf} from '@angular/common';
import {
  ProfileDropdownComponent
} from '../../component/profile-dropdown/profile-dropdown.component';
import {ThemeSelectorComponent} from '../../component/theme-selector/theme-selector.component';
import {rxResource} from '@angular/core/rxjs-interop';
import {Role} from '../../model/role.model';
import {ClickOutsideDirective} from '../../directive/click-outside.directive';
import {HttpClient} from '@angular/common/http';
import {FileUpload} from 'primeng/fileupload';

@Component({
  selector: "authenticated-layout",
  imports: [RouterModule, NgIf, ProfileDropdownComponent, ThemeSelectorComponent, ClickOutsideDirective, FileUpload],
  templateUrl: "./authenticated-layout.component.html",
  providers: []
})
export class AuthenticatedLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly httpClient = inject(HttpClient);
  protected readonly Role = Role;
  protected readonly isAdminMenuOpen = signal<boolean>(false);
  protected readonly isAuthenticated = rxResource({loader: () => this.authService.isAuthenticated()});
  protected readonly isWorkspaceMenuOpen = signal<boolean>(false);
  protected readonly user = rxResource({loader: () => this.authService.getUser()});

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
        .post(`http://localhost:4000/api/v1/misc/beautify-html-table`, reader.result, {
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
