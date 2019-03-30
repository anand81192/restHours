import { Component } from '@angular/core';
import { Http } from '@angular/http';
import * as papa from 'papaparse';
import { Restaurant } from './restaurant';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  csvData: any[] = [];
  headerRow: any[] = [];
  file: File;
  userSelectedDateTime: any;
  public restaurantsOpend: any = [];
  constructor(private http: Http) {
    console.log("extract11");
  }

  public loadCSVfile($event): void {
    this.file = $event.target.files[0];
  }

  public loadDateTime($event): void {
    this.userSelectedDateTime = new Date($event.target.value);
  }

  public findOpenRest(hotels: any, dateTimeObj: Date) {

    
    for (let i = 0; i < hotels.length; i++) {
      let rest = new Restaurant(hotels[i][0], hotels[i][1]);
      if (rest.isOpen(dateTimeObj)) {
        this.restaurantsOpend.push(rest);
        console.log(rest.getTimming());
      }
    }

    // for (let res of restaurants) {
    //   if (res.isOpen(dateTimeObj)) {

    //     console.log(res.getName());

    //   }
    // }

  }

  public showOpenReast(): void {
    let parsedDataa;
    papa.parse(this.file, {
      header: false,
      dynamicTyping: true,
      complete: (results) => {
        parsedDataa = results;
        this.findOpenRest(parsedDataa.data, this.userSelectedDateTime);
      }
    });



  }






}
