import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'getEmailFromCommitAuthor'
})

export class GetEmailFromCommitAuthorPipe implements PipeTransform {
    transform(value: string, args?: any[]) {
        if (!value) {
            value = '';
        }

        return value.substring(value.lastIndexOf('<') + 1, value.trim().length - 1);
    }
}
