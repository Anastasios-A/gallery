import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpContextToken,
} from '@angular/common/http';
import { Observable, catchError, retry, throwError, timer } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
export const SKIP_INTERCEPTOR = new HttpContextToken<boolean>(() => false);

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private snackBar = inject(MatSnackBar);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.context.get(SKIP_INTERCEPTOR)) {
      return next.handle(req);
    }

    return next.handle(req).pipe(
      retry({
        count: 2,
        delay: (_, retryCount) => timer(500 * retryCount),
      }),
      catchError((error: HttpErrorResponse) => {
        let message = 'Something went wrong. Please try again.';

        switch (error.status) {
          case 0:
            message =
              'Cannot connect to the server. Check your network connection.';
            break;
          case 400:
            message = 'Bad request.';
            break;
          case 401:
            message = 'You are not authorized.';
            break;
          case 403:
            message = 'Access denied.';
            break;
          case 404:
            message = 'Requested resource was not found.';
            break;
          case 500:
            message = 'Internal server error.';
            break;
          default:
            if (error.error?.message) {
              message = error.error.message;
            }
            break;
        }

        this.snackBar.open(message, 'Close', {
          duration: 7000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });

        return throwError(() => error);
      })
    );
  }
}
