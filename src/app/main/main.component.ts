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

    localMods: string[] = [];
    downloaded: boolean = false;

    constructor(private ipcService: IpcService, private restService: RestService) {
    }

    ngOnInit(): void {
        this.ipcService.on("get_mods", (event: any, localList: string[]) => {
            console.log(localList);
            this.restService.getModList().subscribe({
                next: async (remoteList) => {
                    if (await this.checkMods(localList, remoteList)) {
                        this.message = "";
                        this.intervalId = setInterval(() => {
                            this.restService.getServerStatus().subscribe({
                                next: (res) => {
                                    this.serverStatus = res["status"];
                                    this.cpuUsage = res["cpu"];
                                    this.ramUsage = res["ram"];
                                    if      (this.serverStatus == "Closed") this.buttonText = "Start server";
                                    else if (this.serverStatus == "Ready")  this.buttonText = "Close server";
                                },
                                error: (err) => console.error(`Request failed with error: ${err}`)
                            });
                        }, 1000);
                    }
                },
                error: (err) => console.error(`Request failed with error: ${err}`)
            })
        });

        this.ipcService.on("download_mod", (event: any, downloaded: boolean) => this.downloaded = downloaded);
        
        this.ipcService.send("get_mods");
    }

    async checkMods(localList: string[], remoteList: string[]): Promise<Boolean> {        
        var repeat: boolean = false;
        for (var i = 0; i < remoteList.length; i++) {
            if (!localList.includes(remoteList[i])) {
                repeat = true
                this.downloaded = false;
                this.message += `Downloading ${remoteList[i]}...`;
                this.ipcService.send("download_mod", remoteList[i]);
                while (!this.downloaded) {
                    await new Promise(r => setTimeout(r, 500));
                    this.message += ".";
                }
                this.message += "<span class='green'> [ DONE ]</span><br/>";
            }
        }
        if (repeat)
            this.ipcService.send("get_mods");
        return !repeat;
    }

    ngOnDestroy(): void {
        clearInterval(this.intervalId);
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
        if      (percentage <= 60) color = "green";
        else if (percentage <= 85) color = "yellow";
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
