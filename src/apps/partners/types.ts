// вообще по хуйне не парьтесь

export interface BecomePartnerRequest {
    name: string;
    type: 'public' | 'private';
    email: string;
    text?: string;
}