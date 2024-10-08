import z from 'zod';

export const UploadSchema = z.object({
  body: z.object({
    image: z.string({
      required_error: `field 'image' is required`,
      invalid_type_error: `field 'image' must be a string`,
    }).base64({
      message: `field 'image' must be a valid base64 string`,
    }),
  
    customer_code: z.string({
      required_error: `fiel 'customer_code' is required`,
      invalid_type_error: `field 'customer_code' must be a string`,
    }),
  
    measure_datetime: z.string({
      required_error: `field 'measure_datetime' is required`,
      invalid_type_error: `field 'measure_datetime' must be a string`,
    }).datetime(
      `field 'measure_datetime' must be a valid date string`
    ),
    
    measure_type: z.enum([`WATER`, `GAS`], {
      required_error: `field 'measure_type' is required`,
      invalid_type_error: `field 'measure_type' must be a string`
    })
  })
});
