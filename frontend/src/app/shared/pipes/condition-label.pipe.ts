import { Pipe, PipeTransform } from '@angular/core';
import { Condition } from '../components/badge/badge';

const LABELS: Record<Condition, string> = {
  mint: 'Mint',
  fieldReady: 'Field-Ready',
  battleScarred: 'Battle-Scarred',
};

@Pipe({ name: 'conditionLabel' })
export class ConditionLabelPipe implements PipeTransform {
  transform(condition: Condition | null | undefined): string {
    return condition ? LABELS[condition] : '';
  }
}
