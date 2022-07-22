import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../services/rest.service';

@Component({
    selector: 'app-console',
    templateUrl: './console.component.html',
    styleUrls: ['./console.component.css']
})
export class ConsoleComponent implements OnInit, OnDestroy {
    @ViewChild('scroll', { read: ElementRef }) public scroll: ElementRef<any> | undefined;
    message: string = "";
    rawMessage: string = "";
    intervalId: any;

    constructor(private restService: RestService, private cdRef: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.intervalId = setInterval(() => {
            this.restService.getServerStatus().subscribe({
                next: (res) => {
                    var status = res["status"];
                    if (status == "Ready" || status == "Starting")
                        this.restService.getServerOutput().subscribe({
                            next: (res) => {
                                var newMessage = res["output"];
                                if (newMessage != this.rawMessage) {
                                    this.rawMessage = newMessage;
                                    this.message = this.formatMessage(newMessage);
                                    this.cdRef.detectChanges();
                                    if (this.scroll != undefined)
                                        this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
                                }
                            },
                            error: (err) => console.error(`Request failed with error: ${err}`)
                        })
                },
                error: (err) => console.error(`Request failed with error: ${err}`)
            });
        }, 1000);
    }

    ngOnDestroy(): void {
        clearInterval(this.intervalId);
    }

    formatMessage(message: string): string {
        var formattedMessage = "";

        message.split("\n").forEach((line) => {
            if      (line.indexOf("INFO") !== -1)  line = `<span class="info">${line}</span>`
            else if (line.indexOf("WARN") !== -1)  line = `<span class="warn">${line}</span>`
            else if (line.indexOf("ERROR") !== -1) line = `<span class="error">${line}</span>`
            
            formattedMessage += `${line}<br/>`
        })

        return formattedMessage;
    }

}
