import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Player } from '../types/player';

const httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json", "Authorization": "c31z" })
};

@Injectable({
    providedIn: 'root'
})
export class RestService {
    private endpoint: string;
    constructor(private http: HttpClient) {
        this.endpoint = `http://kebabaser.ddns.net:5000/api/v1`
    }

    public getServerStatus(): Observable<any> {
        return this.http.get(`${this.endpoint}/server/status`, httpOptions);
    }

    public startServer(): Observable<any> {
        return this.http.get(`${this.endpoint}/server/start`, httpOptions);
    }

    public stopServer(): Observable<any> {
        return this.http.get(`${this.endpoint}/server/stop`, httpOptions);
    }

    public sendCommand(command: string): Observable<any> {
        return this.http.post(`${this.endpoint}/server/command?command=${command}`, httpOptions);
    }

    public getServerForgeVersion(): Observable<any> {
        return this.http.get(`${this.endpoint}/server/forgeVersion`, httpOptions);
    }

    public getModList(): Observable<string[]> {
        return this.http.get<string[]>(`${this.endpoint}/server/mods/list`, httpOptions);
    }

    public getServerOutput(): Observable<any> {
        return this.http.get(`${this.endpoint}/server/output`, httpOptions);
    }

    public getServerPlayers(): Observable<Player[]> {
        return this.http.get<Player[]>(`${this.endpoint}/server/players`, httpOptions);
    }
}
