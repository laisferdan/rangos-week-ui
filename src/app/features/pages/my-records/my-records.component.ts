import { CommonModule } from '@angular/common';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CapitalizeFirstLetterPipe } from '../../../shared/pipes/capitalize-first-letter.pipe';
import { Chart, registerables } from 'chart.js';

interface Food {
  name: string;
  quantity: number;
  calories: number;
}

interface Meal {
  name: string;
  calories: number;
  foods: Food[];
}

interface Record {
  date: Date;
  totalCalories: number;
  meals: Meal[];
}

@Component({
  selector: 'app-my-records',
  standalone: true,
  imports: [CommonModule, FormsModule, CapitalizeFirstLetterPipe],
  templateUrl: './my-records.component.html',
  styleUrl: './my-records.component.css',
})
export class MyRecordsComponent implements OnInit {
  @ViewChild('caloriesChart', { static: true })
  caloriesChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('mealChart', { static: true })
  mealChartRef!: ElementRef<HTMLCanvasElement>;

  public selectedDate: string = '';
  public selectedMeal: string = '';
  public totalCalories: number = 0;
  public totalMeals: number = 0;
  public totalFoods: number = 0;
  public filteredRecords: Record[] = [];
  public expandedDates: Set<string> = new Set();

  private allRecords: Record[] = [];
  private caloriesChart?: Chart;
  private mealChart?: Chart;

  ngOnInit() {
    Chart.register(...registerables);
    this.loadMockData();
    this.calculateSummary();
    this.filteredRecords = [...this.allRecords];
    setTimeout(() => {
      this.generateChartsData();
    }, 100);
  }

  private loadMockData() {
    // Dados mockados para demonstração
    this.allRecords = [
      {
        date: new Date('2025-10-15'),
        totalCalories: 1850,
        meals: [
          {
            name: 'Café da manhã',
            calories: 350,
            foods: [
              { name: 'Pão integral', quantity: 50, calories: 120 },
              { name: 'Ovo cozido', quantity: 60, calories: 90 },
              { name: 'Leite desnatado', quantity: 200, calories: 70 },
              { name: 'Banana', quantity: 100, calories: 70 },
            ],
          },
          {
            name: 'Almoço',
            calories: 650,
            foods: [
              { name: 'Arroz integral', quantity: 100, calories: 130 },
              { name: 'Frango grelhado', quantity: 120, calories: 200 },
              { name: 'Salada verde', quantity: 150, calories: 30 },
              { name: 'Azeite', quantity: 10, calories: 90 },
              { name: 'Feijão', quantity: 80, calories: 200 },
            ],
          },
          {
            name: 'Jantar',
            calories: 450,
            foods: [
              { name: 'Salmão grelhado', quantity: 150, calories: 300 },
              { name: 'Batata doce', quantity: 100, calories: 100 },
              { name: 'Brócolis', quantity: 80, calories: 50 },
            ],
          },
          {
            name: 'Lanche da tarde',
            calories: 400,
            foods: [
              { name: 'Iogurte grego', quantity: 150, calories: 150 },
              { name: 'Granola', quantity: 30, calories: 120 },
              { name: 'Morango', quantity: 100, calories: 30 },
              { name: 'Castanha do Pará', quantity: 20, calories: 100 },
            ],
          },
        ],
      },
      {
        date: new Date('2025-10-14'),
        totalCalories: 2100,
        meals: [
          {
            name: 'Café da manhã',
            calories: 400,
            foods: [
              { name: 'Aveia', quantity: 50, calories: 180 },
              { name: 'Leite de amêndoa', quantity: 200, calories: 60 },
              { name: 'Maçã', quantity: 120, calories: 60 },
              { name: 'Mel', quantity: 15, calories: 50 },
              { name: 'Nozes', quantity: 20, calories: 50 },
            ],
          },
          {
            name: 'Almoço',
            calories: 750,
            foods: [
              { name: 'Quinoa', quantity: 80, calories: 120 },
              { name: 'Peixe assado', quantity: 150, calories: 250 },
              { name: 'Legumes refogados', quantity: 200, calories: 80 },
              { name: 'Azeite', quantity: 15, calories: 135 },
              { name: 'Lentilha', quantity: 100, calories: 165 },
            ],
          },
          {
            name: 'Jantar',
            calories: 550,
            foods: [
              { name: 'Frango grelhado', quantity: 120, calories: 200 },
              { name: 'Purê de abóbora', quantity: 150, calories: 100 },
              { name: 'Espinafre', quantity: 100, calories: 25 },
              { name: 'Azeite', quantity: 10, calories: 90 },
              { name: 'Queijo cottage', quantity: 50, calories: 135 },
            ],
          },
          {
            name: 'Lanche da tarde',
            calories: 400,
            foods: [
              { name: 'Smoothie de frutas', quantity: 300, calories: 200 },
              { name: 'Granola', quantity: 40, calories: 160 },
              { name: 'Chia', quantity: 10, calories: 40 },
            ],
          },
        ],
      },
      {
        date: new Date('2025-10-13'),
        totalCalories: 1950,
        meals: [
          {
            name: 'Café da manhã',
            calories: 320,
            foods: [
              { name: 'Torrada integral', quantity: 40, calories: 100 },
              { name: 'Abacate', quantity: 80, calories: 130 },
              { name: 'Tomate', quantity: 50, calories: 10 },
              { name: 'Café preto', quantity: 200, calories: 5 },
              { name: 'Açúcar', quantity: 5, calories: 20 },
              { name: 'Leite', quantity: 50, calories: 55 },
            ],
          },
          {
            name: 'Almoço',
            calories: 680,
            foods: [
              { name: 'Macarrão integral', quantity: 100, calories: 150 },
              { name: 'Molho de tomate', quantity: 150, calories: 50 },
              { name: 'Carne moída', quantity: 100, calories: 250 },
              { name: 'Queijo parmesão', quantity: 20, calories: 80 },
              { name: 'Azeite', quantity: 10, calories: 90 },
              { name: 'Manjericão', quantity: 10, calories: 50 },
            ],
          },
          {
            name: 'Jantar',
            calories: 450,
            foods: [
              { name: 'Sopa de legumes', quantity: 300, calories: 150 },
              { name: 'Pão integral', quantity: 30, calories: 75 },
              { name: 'Azeite', quantity: 5, calories: 45 },
              { name: 'Frango desfiado', quantity: 80, calories: 180 },
            ],
          },
          {
            name: 'Lanche da tarde',
            calories: 500,
            foods: [
              { name: 'Iogurte natural', quantity: 200, calories: 120 },
              { name: 'Granola', quantity: 50, calories: 200 },
              { name: 'Frutas vermelhas', quantity: 100, calories: 50 },
              { name: 'Mel', quantity: 20, calories: 65 },
              { name: 'Amêndoas', quantity: 15, calories: 65 },
            ],
          },
        ],
      },
    ];
  }

  private calculateSummary() {
    this.totalCalories = this.allRecords.reduce(
      (sum, record) => sum + record.totalCalories,
      0
    );
    this.totalMeals = this.allRecords.reduce(
      (sum, record) => sum + record.meals.length,
      0
    );
    this.totalFoods = this.allRecords.reduce(
      (sum, record) =>
        sum +
        record.meals.reduce((mealSum, meal) => mealSum + meal.foods.length, 0),
      0
    );
  }

  public filterByDate() {
    this.applyFilters();
  }

  public filterByMeal() {
    this.applyFilters();
  }

  private applyFilters() {
    let filtered = [...this.allRecords];

    // Filtrar por data
    if (this.selectedDate) {
      const selectedDateObj = new Date(this.selectedDate);
      filtered = filtered.filter(
        (record) =>
          record.date.toDateString() === selectedDateObj.toDateString()
      );
    }

    // Filtrar por refeição
    if (this.selectedMeal) {
      filtered = filtered
        .map((record) => ({
          ...record,
          meals: record.meals.filter((meal) => meal.name === this.selectedMeal),
        }))
        .filter((record) => record.meals.length > 0);
    }

    this.filteredRecords = filtered;
    this.generateChartsData();
  }

  public toggleDateExpansion(recordId: string): void {
    if (this.expandedDates.has(recordId)) {
      this.expandedDates.delete(recordId);
    } else {
      this.expandedDates.add(recordId);
    }
  }

  public isDateExpanded(recordId: string): boolean {
    return this.expandedDates.has(recordId);
  }

  public getRecordId(record: Record): string {
    return record.date.toISOString();
  }

  private generateChartsData() {
    this.generateCaloriesChart();
    this.generateMealDistributionChart();
  }

  private generateCaloriesChart() {
    if (this.caloriesChart) {
      this.caloriesChart.destroy();
    }

    const sortedRecords = [...this.allRecords].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );

    this.caloriesChart = new Chart(this.caloriesChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: sortedRecords.map((record) =>
          record.date.toLocaleDateString('pt-BR')
        ),
        datasets: [
          {
            data: sortedRecords.map((record) => record.totalCalories),
            label: 'Calorias Totais',
            borderColor: '#E25B45',
            backgroundColor: 'rgba(226, 91, 69, 0.1)',
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            labels: {
              font: {
                family: 'Albert Sans',
              },
            },
          },
          title: {
            display: true,
            text: 'Calorias por Dia',
            font: {
              family: 'Oleo Script',
              size: 16,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Calorias (kcal)',
              font: {
                family: 'Albert Sans',
              },
            },
          },
          x: {
            title: {
              display: true,
              text: 'Data',
              font: {
                family: 'Albert Sans',
              },
            },
          },
        },
      },
    });
  }

  private generateMealDistributionChart() {
    if (this.mealChart) {
      this.mealChart.destroy();
    }

    const mealTotals = new Map<string, number>();

    this.allRecords.forEach((record) => {
      record.meals.forEach((meal) => {
        const currentTotal = mealTotals.get(meal.name) ?? 0;
        mealTotals.set(meal.name, currentTotal + meal.calories);
      });
    });

    const colors = [
      '#ADC865',
      '#9cba49',
      '#02542D',
      '#E25B45',
      '#d44a35',
      '#f4a261',
    ];

    this.mealChart = new Chart(this.mealChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: Array.from(mealTotals.keys()),
        datasets: [
          {
            data: Array.from(mealTotals.values()),
            backgroundColor: colors.slice(0, mealTotals.size),
            borderColor: colors.slice(0, mealTotals.size),
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              font: {
                family: 'Albert Sans',
              },
            },
          },
          title: {
            display: true,
            text: 'Distribuição de Calorias por Refeição',
            font: {
              family: 'Oleo Script',
              size: 16,
            },
          },
        },
      },
    });
  }
}
