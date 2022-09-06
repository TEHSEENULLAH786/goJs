import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GojsServiceService {

  constructor(private http: HttpClient) { }

  getNode() {
    let url = './assets/gojs.json'
    return this.http.get(url);
  }
  // postNode() {
  //   debugger
  //   let url = './assets/gojs.json'
  //   return this.http.post(url);
  // }

  postNode(data: any) {
    let url = './assets/gojs.json'
    debugger
    return this.http.post<any>(url,data);
  }
}
