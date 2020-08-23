import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/_model/Photo';
import { FileUploader, ParsedResponseHeaders, FileItem } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { User } from 'src/app/_model/User';

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
  loggedInUserId;

  constructor(private authService: AuthService, private userService: UserService, private alertify: AlertifyService) {}

  ngOnInit(): void {
    this.loggedInUserId = this.authService.decodedToken.nameid;
    this.initializeUploader();
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this.loggedInUserId + '/photos',
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
        const photo: Photo = JSON.parse(response);
        this.Photos.push(photo);
        if (photo.isMain) {
          this.authService.setMainPhotoURL(photo.url);
          const user: User = JSON.parse(localStorage.getItem('user'));
          user.photoURL = photo.url;
          localStorage.setItem('user', JSON.stringify(user));
        }
      }
    };
  }

  setMainPhoto(photo: Photo) {
      this.userService.setMainPhoto(this.loggedInUserId, photo.id).subscribe(() => {
        const currentMainPhoto = this.Photos.filter(p => p.isMain === true)[0];
        currentMainPhoto.isMain = false;
        photo.isMain = true;
        this.authService.setMainPhotoURL(photo.url);
        const user: User = JSON.parse( localStorage.getItem('user'));
        user.photoURL = photo.url;
        localStorage.setItem('user', JSON.stringify(user));
      }, error => {
        this.alertify.error(error);
      });
  }

  deletePhoto(id: number) {
    this.alertify.confirm('Are you sure you want to delete this photo', () => {
      this.userService.deletePhoto(this.loggedInUserId, id).subscribe(() => {
        this.alertify.success('Photo deleted successfully.');
        this.Photos.splice(this.Photos.findIndex(p => p.id === id), 1);
      }, error => {
        this.alertify.error(error);
      });
    });
  }
}
