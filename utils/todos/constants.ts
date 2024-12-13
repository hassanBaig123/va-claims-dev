// constants.ts

export type UserTier =
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'upgrade_bronze_to_silver'
  | 'upgrade_bronze_to_gold'
  | 'upgrade_silver_to_gold'
  | 'one_time_pay_test'
  | 'grandmaster'
  | 'master'
  | 'expert'
  | 'upgrade_expert_to_master'
  | 'upgrade_master_to_grandmaster'
  | 'upgrade_expert_to_grandmaster'

export const TIERS_NEEDING_INTAKE: UserTier[] = [
  'silver',
  'gold',
  'upgrade_bronze_to_silver',
  'upgrade_bronze_to_gold',
  'upgrade_silver_to_gold',
  'one_time_pay_test',
]

export const TIERS_TAKING_COURSES: UserTier[] = [
  'silver',
  'gold',
  'upgrade_bronze_to_silver',
  'upgrade_bronze_to_gold',
  'upgrade_silver_to_gold',
  'one_time_pay_test',
  'grandmaster',
  'master',
  'expert',
  'upgrade_expert_to_master',
  'upgrade_master_to_grandmaster',
  'upgrade_expert_to_grandmaster',
]

export const TIERS_SCHEDULING_CALL: UserTier[] = [
  'gold',
  'upgrade_bronze_to_gold',
  'upgrade_silver_to_gold',
  'silver',
  'upgrade_bronze_to_silver',
  'one_time_pay_test',
  'grandmaster',
  'upgrade_master_to_grandmaster',
  'upgrade_expert_to_grandmaster',
]

export const TIERS_GOLD_OR_TEST: UserTier[] = [
  'gold',
  'upgrade_bronze_to_gold',
  'upgrade_silver_to_gold',
  'one_time_pay_test',
]

export const TIERS_OLD_USER: UserTier[] = [
  'grandmaster',
  'upgrade_master_to_grandmaster',
  'upgrade_expert_to_grandmaster',
]

export const TIERS_SILVER_OR_UPGRADE: UserTier[] = [
  'silver',
  'upgrade_bronze_to_silver',
]
