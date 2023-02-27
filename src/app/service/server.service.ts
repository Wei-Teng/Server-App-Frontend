import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Status } from '../enum/status.enum';
import { CustomResponse } from '../interface/custom-response';
import { Server } from '../interface/server';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private readonly apiUrl = 'http://localhost:8080/server'

  constructor(private http: HttpClient) { }

  servers$ = <Observable<CustomResponse>>
    this.http.get<CustomResponse>(`${this.apiUrl}/list`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      )

  save$ = (server: Server) => <Observable<CustomResponse>>
    this.http.post<CustomResponse>(`${this.apiUrl}/save`, server)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      )

  ping$ = (ipAddress: string) => <Observable<CustomResponse>>
    this.http.get<CustomResponse>(`${this.apiUrl}/ping/${ipAddress}`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      )

  delete$ = (serverId: number) => <Observable<CustomResponse>>
    this.http.delete<CustomResponse>(`${this.apiUrl}/delete/${serverId}`)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      )

  filter$ = (status: string, response: CustomResponse) => <Observable<CustomResponse>>
    new Observable<CustomResponse>(
      subscriber => {
        console.log(response)
        subscriber.next(
          "ALL" === status ?
            { ...response, message: `Server filtered by ${status} status` } :
            {
              ...response,
              message: response.data.servers!.filter(server => server.status === status).length > 0 ?
                `Servers filtered by ${Status.SERVER_UP === status ? "SERVER UP" : "SERVER DOWN"} status` :
                `No servers of ${Status.SERVER_UP === status ? "SERVER UP" : "SERVER DOWN"} found`,
              data: { servers: response.data.servers?.filter(server => server.status === status) }
            }
        )
        subscriber.complete()
      }
    ).pipe(
      tap(console.log),
      catchError(this.handleError)
    )

  private handleError(e: HttpErrorResponse): Observable<never> {
    console.log(e);
    return throwError(() => `An error occurred - Error code: ${e.status}`)
  }
}
