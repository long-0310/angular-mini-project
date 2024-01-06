import {

    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
    HttpParams,
    HttpResponse,
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {throwError, Observable} from 'rxjs';
import {catchError} from 'rxjs';
@Injectable()
export class apiServiceBase {
    constructor(
        public httpClient: HttpClient,
    ) {
    }


    handleError(error: HttpErrorResponse) {
        return throwError(JSON.stringify(error?.error?.result?.errors));
    }

    public get(url: string, params?: any): Observable<any> {
        return this.httpClient
        .get(url, {params})
        .pipe(catchError(this.handleError));
    }

    public post(url: string, inputData: any, params?: any): Observable<any> {
        return this.httpClient
                .post(url, inputData, {params})
                .pipe(catchError(this.handleError));
    }

    public delete(url: string, params?: any): Observable<any> {
        return this.httpClient
                .delete(url, {params})
                .pipe(catchError(this.handleError));
    }
    
    public put(url: string, inputData: any, params?: any): Observable<any> {
        return this.httpClient
                .put(url, inputData, {params})
                .pipe(catchError(this.handleError));
    }
}
