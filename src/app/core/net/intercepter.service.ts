import { Injectable, Injector } from '@angular/core';
import {
  HttpInterceptor as NgHttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpResponseBase,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

import { CommonHttpResponse } from '@lib';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';

// http 错误码对应错误信息
const CODE_MESSAGE = {
  0: 'Unknown error',
};

// 返回错误码对应错误信息
const RESPONSE_ERROR = {};
// 不弹窗显示的错误码
const INGORE_ERROR = new Set([]);

@Injectable()
export class HttpInterceptor implements NgHttpInterceptor {
  constructor(
    private nzNotification: NzNotificationService,
    private injector: Injector
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      mergeMap((event: any) => {
        // 允许统一对请求错误处理
        if (event instanceof HttpResponseBase) {
          return this.handleError(event);
        }
        // 若一切都正常，则后续操作
        return of(event);
      }),
      catchError((error) => {
        return this.handleError(error);
      })
    );
  }

  private get message(): NzMessageService {
    return this.injector.get(NzMessageService);
  }

  private checkStatus(ev: HttpResponseBase): any {
    if ((ev.status >= 200 && ev.status < 300) || ev.status === 400) {
      return;
    }
    const errortext = CODE_MESSAGE[ev.status] || ev.statusText;
    this.nzNotification.error(`Request error ${ev.status}: `, errortext);
  }

  private handleError(ev: HttpResponseBase): Observable<any> {
    this.checkStatus(ev);
    switch (ev.status) {
      case 200:
        if (ev instanceof HttpResponse) {
          const body: CommonHttpResponse = ev.body;
          if (
            body.status === 'error' &&
            INGORE_ERROR.has(body.error_code) === false
          ) {
            const errortext = RESPONSE_ERROR[body.error_code] || body.error_msg;
            this.message.error(errortext);
          }
          return of(ev);
        }
        break;
    }
    return of(ev);
  }
}
