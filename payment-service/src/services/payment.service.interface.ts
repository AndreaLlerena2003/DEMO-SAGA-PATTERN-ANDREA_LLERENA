import { Payment } from "src/entities/payment.schema";

export interface PaymentServiceInterface {
    authorizePayment(request: { appointmentId: string; amount: number }): Promise<{ authorized: boolean }>; // Cambiado a Promise
    refund(request: { appointmentId: string; amount: number }): Promise<void>;
    authorize(request: { appointmentId: string }): Promise<void>; 
    cancel(request: { appointmentId: string }): Promise<void>; 
}
