import { Component, OnInit } from '@angular/core';
import { Brackets } from 'src/app/model/bracket';
import { BracketsService } from 'src/app/services/brackets/brackets.service';

@Component({
  selector: 'app-calculation',
  templateUrl: './calculation.component.html',
  styleUrls: ['./calculation.component.scss'],
})
export class CalculationComponent implements OnInit {
  constructor(private brackestService: BracketsService) { }

  brackets!: Brackets;
  value: number = 0;
  payments: any;
  total: number = 0;

  byYear: boolean = false;
  year: number = new Date().getFullYear() - 1;
  maxYear: number = new Date().getFullYear() - 1;

  finished: boolean | undefined = undefined

  ngOnInit(): void { }

  calculate() {
    this.finished = false
    this.payments = new Array();
    this.total = 0;

    if (this.byYear) {
      this.brackestService
        .getByYear(this.year.toString()).subscribe((result) => {
          this.brackets = result;
          this.createValues();
        }, error => {
          this.handleError(error)

        });
    } else {
      this.brackestService.get().subscribe((result) => {
        this.brackets = result;
        this.createValues();
      });
    }
  }

  createValues() {
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

    this.finished = true
  }

  handleError(error: any) {
    if (confirm(`Unfortunately, we had an ${error.error.errors[0].code}: ${error.error.errors[0].message}\nWould you like to try again?`)) {
      this.calculate()
    } else {
      //do nothing
    }

  }
}
