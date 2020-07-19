import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { User } from '../../_model/User';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: User[];
  constructor(private userService: UserService, private alertify: AlertifyService) { }

  ngOnInit(): void {
    this.loadUsers();
  }
    loadUsers() {
      this.userService.getUsers().subscribe((usersdata: User[]) => {
        this.users = usersdata;
      }, error => {
        this.alertify.error(error);
      });
    }
}
