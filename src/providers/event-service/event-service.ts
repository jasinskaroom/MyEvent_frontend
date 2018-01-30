import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ApiServiceProvider } from '../api-service/api-service';
import * as App from '../../config/app';

/*
  Generated class for the EventServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class EventServiceProvider {

  constructor(public http: Http, public apiService: ApiServiceProvider) {

  }

  getLiveEventDetail() {
      return this.apiService.get('/live-event-detail');
  }

  markGameComplete(scoreCode, stageId, gameId, gameType, fields = []) {
      return this.apiService.post('/complete-game', {
          score_code: scoreCode,
          stage_id: stageId,
          game_id: gameId,
          game_type: gameType,
          fields: fields
      });
  }

  getParticipantScore(userToken = undefined) {
      if (userToken != undefined) {
          return new Promise(resolve => {
            this.http.get(App.API_ENDPOINT + '/get-participant-score' + '?' + 'api_token=' + userToken)
              .map(res => res.json())
              .subscribe(data => {
                resolve(data);
              });
          });
      }
      else {
          return this.apiService.get('/get-participant-score');
      }
  }

}
