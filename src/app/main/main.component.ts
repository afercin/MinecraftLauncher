import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { RestService } from '../services/rest.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {
    buttonText: string = "Start server";
    serverStatus: string = "Closed";
    intervalId: any;

    constructor(private cdRef: ChangeDetectorRef, private restService: RestService) {
    }


    ngOnInit(): void {
        this.intervalId = setInterval(() => {
            this.restService.getServerStatus().subscribe({
                next: (res) => {
                    this.serverStatus = res["status"];
                    if (this.serverStatus == "Closed")
                        this.buttonText = "Start server"
                },
                error: (err) => console.error(`Request failed with error: ${err}`)
            });
        }, 1000)

    }

    ngOnDestroy(): void {
        clearInterval(this.intervalId);
    }

    toogleServer(): void {

    }
}
