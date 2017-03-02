import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { User } from './user';
import { Purchase } from './purchase';

declare var Config: any; //  this comes from the autogenerated config.js file
@Injectable()
export class PurchaseService {
  private usersUrl = Config.frontend.url + '/users' ;
  // /users/{user_id}/purchases
  private headers = new Headers ({'Content-Type': 'application/json'});

  constructor (private http: Http) { }
  getPurchases(user: User): Promise<Purchase[]> {
    return this.http.get(this.usersUrl + '/' + user.userID + '/purchases')
      .toPromise()
      .then(function (response) {
        let purchases: Purchase[] = [];
        for (let ResponseItem of response.json()) {
          let p = new Purchase;
          p.label = ResponseItem.label;
          p.licenseID = ResponseItem.licenseID;
          p.purchaseID = ResponseItem.purchaseID;
          p.resource = ResponseItem.resource;
          p.transactionDate = ResponseItem.transactionDate;
          p.user = ResponseItem.user;
          p.partialLicense = ResponseItem.partialLicense;
          purchases[purchases.length] = p;
        }
        return purchases;
      })
      .catch(this.handleError);
  }

  create(purchase: Purchase): Promise<Purchase> {
    return this.http
      .put(this.usersUrl + '/' + purchase.user.userID + '/purchases', JSON.stringify(purchase), {headers: this.headers})
      .toPromise()
      .then(function (response) {
          if ((response.status === 200) || (response.status === 201)) {
            return purchase; // ok
          } else {
            throw 'Error in create(purchase); ' + response.status + response.text;
          }
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred (purchase-service)', error);
    return Promise.reject(error.message || error);
  }

}