import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';


@Component({
  selector: 'ngx-chart-panel-header',
  styleUrls: ['./chart-panel-header.component.scss'],
  templateUrl: './chart-panel-header.component.html',
})
export class ChartPanelHeaderComponent implements OnDestroy {

  private alive = true;

  @Output() periodChange = new EventEmitter<string>();

  @Input() type: string = 'week';

  types: string[] = ['week', 'month', 'year'];
  chartLegend: {iconColor: string; title: string}[];
  breakpoint: NbMediaBreakpoint = { name: '', width: 0 };
  breakpoints: any;
  currentTheme: string;

  constructor(private themeService: NbThemeService,
              private breakpointService: NbMediaBreakpointsService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        const JobStateChartLegend = theme.variables.JobStateChartLegend;

        this.currentTheme = theme.name;
        this.setLegendItems(JobStateChartLegend);
      });

      this.breakpoints = this.breakpointService.getBreakpointsMap();
      this.themeService.onMediaQueryChange()
        .pipe(takeWhile(() => this.alive))
        .subscribe(([oldValue, newValue]) => {
          this.breakpoint = newValue;
        });
  }

  setLegendItems(JobStateChartLegend) {
    this.chartLegend = [
      {
        iconColor: JobStateChartLegend.firstItem,
        title: 'Completed',
      },
      {
        iconColor: JobStateChartLegend.secondItem,
        title: 'Failed',
      },
      {
        iconColor: 'red',
        title: 'Canceled',
      },
      {
        iconColor: JobStateChartLegend.fourthItem,
        title: 'Paused',
      },
      {
        iconColor: JobStateChartLegend.fifthItem,
        title: 'All orders',
      },
    ];
  }

  changePeriod(period: string): void {
    this.type = period;
    this.periodChange.emit(period);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
