import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  OnInit
} from '@angular/core';

import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import {
  ColComponent,
  RowComponent,
  WidgetStatDComponent
} from '@coreui/angular';

import { ChartData } from 'chart.js';
import { HttpConnectService } from '../../../Services/http-connect.service';
import { RouterLink, RouterOutlet } from '@angular/router';

type BrandData = {
  icon: string;
  values: any[];
  capBg?: any;
  color?: string;
  labels?: string[];
  data: ChartData;
  router: string;
  queryParams: {};
};

@Component({
  selector: 'app-widgets-brand',
  templateUrl: './widgets-brand.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    RowComponent,
    ColComponent,
    WidgetStatDComponent,
    IconDirective,
    ChartjsComponent,
    RouterLink,
    RouterOutlet
  ]
})
export class WidgetsBrandComponent
  implements OnInit, AfterContentInit {

  CountUnProccessedImages = 0;
  CountUnnScrapedItems = 0;
  CountUnPublishedItems = 0;
  CountUnPublishedOnMarket = 0;
  constructor(
    private http: HttpConnectService
  ) { }

  private changeDetectorRef = inject(ChangeDetectorRef);

  readonly withCharts = input<boolean>();

  labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July'
  ];

  datasets = {
    borderWidth: 2,
    fill: true
  };

  colors = {
    backgroundColor: 'rgba(255,255,255,.1)',
    borderColor: 'rgba(255,255,255,.55)',
    pointHoverBackgroundColor: '#fff',
    pointBackgroundColor: 'rgba(255,255,255,.55)'
  };

  chartOptions = {
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3
      }
    },

    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false
      }
    },

    scales: {
      x: {
        display: false
      },

      y: {
        display: false
      }
    }
  };

  brandData: BrandData[] = [];

  ngOnInit() {

    const currentBusinessId =
      localStorage.getItem('businessId');

    this.http
      .getAllData(`StartInformation/${currentBusinessId}`)
      .subscribe((res: any) => {

        console.log(res);

        this.CountUnProccessedImages =
          res.countUnProccessedImages;

        this.CountUnnScrapedItems =
          res.countUnnScrapedItems;

        this.CountUnPublishedItems =
          res.countUnPublishedItems;
        this.CountUnPublishedOnMarket = res.countUnPublishedOnMarket

        this.buildBrandData();

        this.changeDetectorRef.detectChanges();
      });
  }

  buildBrandData() {

    this.brandData = [
      {
        icon: '',
        values: [
          {
            title: 'Un proccessed',
            value: this.CountUnProccessedImages
          }
        ],

        capBg: {
          '--cui-card-cap-bg': '#3b5998'
        },

        labels: [...this.labels],
        router: '/Home/album',
        queryParams: {
          filtter: 'Unprocessed'
        },

        data: {
          labels: [...this.labels],

          datasets: [
            {
              ...this.datasets,

              data: [
                65,
                59,
                84,
                84,
                51,
                55,
                40
              ],

              ...this.colors
            }
          ]
        }
      },

      {
        icon: '',

        values: [
          {
            title: 'Un Screaped',
            value: this.CountUnnScrapedItems
          }
        ],

        capBg: {
          '--cui-card-cap-bg': '#00aced'
        },

        router: '/Home/inventory',

        queryParams: {
          filtter: 'needScrape'
        },

        data: {
          labels: [...this.labels],

          datasets: [
            {
              ...this.datasets,

              data: [
                1,
                13,
                9,
                17,
                34,
                41,
                38
              ],

              ...this.colors
            }
          ]
        }
      },

      {
        icon: '',

        values: [
          {
            title: 'Un published in Ebay',
            value: this.CountUnPublishedItems
          }
        ],

        capBg: {
          '--cui-card-cap-bg': '#4875b4'
        },

        router: '/Home/inventory',

        queryParams: {
          filtter: 'unpublished'
        },

        data: {
          labels: [...this.labels],

          datasets: [
            {
              ...this.datasets,

              data: [
                78,
                81,
                80,
                45,
                34,
                12,
                40
              ],

              ...this.colors
            }
          ]
        }
      },

      {
        icon: '',

        values: [
          {
            title: 'Un published in MarketPlace',
            value: this.CountUnPublishedOnMarket
          }
        ],

        capBg: {
          '--cui-card-cap-bg': 'var(--cui-warning)'
        },

        router: '/Home/inventory',

        queryParams: {
          filtter: 'unpublishedOnMarketPlace'
        },

        data: {
          labels: [...this.labels],

          datasets: [
            {
              ...this.datasets,

              data: [
                35,
                23,
                56,
                22,
                97,
                23,
                64
              ],

              ...this.colors
            }
          ]
        }
      }
    ];
  }

  capStyle(value: string) {
    return value
      ? { '--cui-card-cap-bg': value }
      : {};
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
  }
}