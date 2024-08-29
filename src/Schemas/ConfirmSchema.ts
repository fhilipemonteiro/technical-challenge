import z from 'zod';

export const ConfirmSchema = z.object({
  measure_uuid: z.string({
    required_error: `field 'measure_uuid' is required`,
    invalid_type_error: `field 'measure_uuid' must be a string`,
  }).uuid(
    `field 'measure_uuid' must be a valid UUID string`
  ),

  confirmed_value: z.number({
    required_error: `field 'confirmed_value' is required`,
    invalid_type_error: `field 'confirmed_value' must be a number`,
  }).int(
    `field 'confirmed_value' must be an integer`
  ),
});