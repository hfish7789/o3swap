import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { zip } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
    langData;
    constructor(private http: HttpClient) {}

    load(): Promise<any> {
        // only works with promises
        // https://github.com/angular/angular/issues/15088
        return new Promise(resolve => {
            zip(this.http.get('assets/tmp/language.json'))
                .pipe(
                    // 接收其他拦截器后产生的异常消息
                    catchError(([langData]) => {
                        resolve(null);
                        return [langData];
                    })
                )
                .subscribe(
                    ([langData]) => {
                        this.langData = langData;
                    },
                    () => {},
                    () => {
                        resolve(null);
                    }
                );
        });
    }
}
