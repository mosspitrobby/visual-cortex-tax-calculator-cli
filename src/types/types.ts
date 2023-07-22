export interface IncomeInfo {
    year: string;
    income: number;
}

export interface TaxResponse {
    tax: string;
}

export interface ErrorResponse {
    error: string;
}

export function isTypeTaxResponse(obj: object): obj is TaxResponse {
    return "tax" in obj && typeof obj.tax === "string";
}

export function isTypeErrorResponse(obj: object): obj is ErrorResponse {
    return "error" in obj && typeof obj.error === "string";
}
