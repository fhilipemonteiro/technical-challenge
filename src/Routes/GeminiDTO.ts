export interface UploadDTO {
  image: string;
  customer_code: string;
  measure_datetime: string;
  measure_type: string;
}

export interface UploadResponseDTO {
  image_url: string;
  measure_value: number;
  measure_uuid: string;
}

export interface ConfirmDTO {
  measure_uuid: string;
  confirmed_value: number;
}

export interface ConfirmResponseDTO {
  success: boolean;
}

export interface ListMeasuresDTO {
  params: {
    customer_code: string;
  },
  query: {
    measure_type: string;
  }
}

export interface ListMeasuresResponseDTO {
  customer_code: string;
  measures: {
    measure_uuid: string;
    measure_datetime: string;
    measure_type: string;
    has_confirmed: boolean;
    image_url: string;
  }[]
}