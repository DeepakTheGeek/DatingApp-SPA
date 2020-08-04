import { Component, OnInit, Input } from '@angular/core';
import { Photo } from 'src/app/_model/Photo';
import { FileUploader, ParsedResponseHeaders, FileItem } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() Photos: Photo[];
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  response = '';
  baseUrl = environment.apiURL;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.initializeUploader();
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this.authService.decodedToken.nameid + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onSuccessItem =
    (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        // console.log('Photo:', res);
        this.Photos.push(res);
      }
    };
  }
}
