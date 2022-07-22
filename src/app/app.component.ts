import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { RestService } from './services/rest.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'Kebab a ser Launcher';

    constructor() {
    }

    ngOnInit(): void {

    }
}
