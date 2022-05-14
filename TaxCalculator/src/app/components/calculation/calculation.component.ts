import { Component, OnInit } from '@angular/core';
import { Bracket, Brackets } from 'src/app/model/bracket';
import { BracketsService } from 'src/app/services/brackets/brackets.service';

@Component({
  selector: 'app-calculation',
  templateUrl: './calculation.component.html',
  styleUrls: ['./calculation.component.scss'],
})
export class CalculationComponent implements OnInit {
  constructor(private brackestService: BracketsService) {}

  brackets!: Brackets;
  value: any;
  payments: any;
  total: number = 0;

  ngOnInit(): void {
    this.brackestService.get().subscribe((result) => {
      this.brackets = result;
    });
    // this.brackestService.getByYear('2020').subscribe((result) => {
    //   console.log('by year', result);
    // });
  }

  calculate() {
    this.payments = new Array();
    this.total = 0
    var localValue = this.value;
    
    for (var i = this.brackets.tax_brackets.length - 1; i >= 0; i--) {
      if (localValue > this.brackets.tax_brackets[i].min) {
        var moreThan = localValue - this.brackets.tax_brackets[i].min;
        localValue = localValue - moreThan;
        this.payments.push({
          value: moreThan,
          rate: this.brackets.tax_brackets[i].rate,
          owed: (moreThan * this.brackets.tax_brackets[i].rate).toFixed(2),
        });
      }
    }

    this.payments.forEach((element: any) => {
      this.total += parseInt(element.owed);
    });
  }
}
