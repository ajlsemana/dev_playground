import { Injectable } from '@nestjs/common';
import rules from './rules.json';

type CaseInput = {
  dpd: number;
  riskScore: number;
};

type Decision = {
  matchedRules: string[];
  stage?: string;
  assignedTo?: string | null;
  reason: string;
};

@Injectable()
export class RulesService {
  evaluate(input: CaseInput): Decision {
    const matched: string[] = [];
    let stage: string | undefined;
    let assignedTo: string | undefined;

    for (const r of rules as any[]) {
      const okDpd =
        r.when?.dpdMin === undefined ? true : input.dpd >= r.when.dpdMin;
      const okDpdMax =
        r.when?.dpdMax === undefined ? true : input.dpd <= r.when.dpdMax;
      const okRisk =
        r.when?.riskMin === undefined ? true : input.riskScore >= r.when.riskMin;

      const isMatch = okDpd && okDpdMax && okRisk;
      if (!isMatch) continue;

      matched.push(r.name);

      if (r.then?.stage) stage = r.then.stage;
      if (r.then?.assignedTo) assignedTo = r.then.assignedTo;
    }

    const reasonParts: string[] = [];
    if (matched.includes('DPD_1_7')) reasonParts.push(`dpd=${input.dpd} -> Tier1`);
    if (matched.includes('DPD_8_30')) reasonParts.push(`dpd=${input.dpd} -> Tier2`);
    if (matched.includes('DPD_GT_30')) reasonParts.push(`dpd=${input.dpd} -> Legal`);
    if (matched.includes('RISK_GT_80_OVERRIDE')) reasonParts.push(`riskScore=${input.riskScore} -> SeniorAgent override`);

    return {
      matchedRules: matched,
      stage,
      assignedTo: assignedTo ?? null,
      reason: reasonParts.join('; ') || 'No rules matched',
    };
  }
}