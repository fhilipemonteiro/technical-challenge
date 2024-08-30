import z from 'zod';

export const ListMeasuresSchema = z.object({
  params: z.object({
    customer_code: z.string({
      required_error: `params 'customer_code' is required`,
      invalid_type_error: `params 'customer_code' must be a string`,
    })
  }),

  query: z.object({
    measure_type: z.enum(['water', 'WATER', 'gas', 'GAS'], {
      required_error: `query 'measure_type' is required`,
      invalid_type_error: `query 'measure_type' must be a string`,
      message: `Tipo de medição não permitida`
    }).optional()
  }),
});