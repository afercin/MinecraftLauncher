import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { IpcService } from '../services/ipc.service';
import { RestService } from '../services/rest.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {
    buttonText: string = "Start server";
    message: string = "";
    serverStatus: string = "NaN";
    intervalId: any;
    cpuUsage: any = "NaN";
    ramUsage: any = "Nan";

    constructor(private ipcService: IpcService, private restService: RestService) {
    }


    ngOnInit(): void {
        this.checkMods();

        this.intervalId = setInterval(() => {
            this.restService.getServerStatus().subscribe({
                next: (res) => {
                    this.serverStatus = res["status"];
                    this.cpuUsage = res["cpu"];
                    this.ramUsage = res["ram"];
                    if      (this.serverStatus == "Closed") this.buttonText = "Start server"
                    else if (this.serverStatus == "Ready")  this.buttonText = "Close server"
                },
                error: (err) => console.error(`Request failed with error: ${err}`)
            });
        }, 1000)

    }

    ngOnDestroy(): void {
        clearInterval(this.intervalId);
    }

    checkMods(): void {
        this.restService.getModList().subscribe({
            next: (res) => this.ipcService.send("check_mods", res),
            error: (err) => console.error(`Request failed with error: ${err}`)
        })
        
    }

    getStatusColor(): string {
        var color: string;
        switch(this.serverStatus) {
            case "Ready": color = "green"; break;
            case "Closed": color = "gray"; break;
            case "Clossing": color = "red"; break;
            case "Starting": color = "yellow"; break;
            default: color = "white"; break;
        }
        return color;
    }

    getPercentageColor(percentage: number): string {
        var color: string = "red";
        if      (percentage <= 60) color = "green"
        else if (percentage <= 85) color = "yellow"
        return color;
    }

    toogleServer(): void {
        if (this.serverStatus == "Closed")
            this.restService.startServer().subscribe({
                next: (res) => {
                    
                },
                error: (err) => console.error(`Request failed with error: ${err}`)
            })
        if (this.serverStatus == "Ready")
            this.restService.stopServer().subscribe({
                next: (res) => {
                    
                },
                error: (err) => console.error(`Request failed with error: ${err}`)
            })
    }
}
