import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IpcService } from '../services/ipc.service';
import { RestService } from '../services/rest.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

    constructor(private cdRef: ChangeDetectorRef, private router: Router, private restService: RestService, private ipcService: IpcService) {
    }


    ngOnInit(): void {
        
    }
}
