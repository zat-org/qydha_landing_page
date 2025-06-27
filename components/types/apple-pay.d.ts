// Apple Pay Types
declare global {
  interface Window {
    ApplePaySession?: typeof ApplePaySession;
  }
}

declare class ApplePaySession {
  static readonly STATUS_SUCCESS: number;
  static readonly STATUS_FAILURE: number;
  static readonly STATUS_INVALID_BILLING_POSTAL_ADDRESS: number;
  static readonly STATUS_INVALID_SHIPPING_POSTAL_ADDRESS: number;
  static readonly STATUS_INVALID_SHIPPING_CONTACT: number;
  static readonly STATUS_PIN_REQUIRED: number;
  static readonly STATUS_PIN_INCORRECT: number;
  static readonly STATUS_PIN_LOCKOUT: number;

  constructor(version: number, paymentRequest: any);

  static canMakePayments(): boolean;
  static canMakePaymentsWithActiveCard(merchantIdentifier: string): Promise<boolean>;
  static openPaymentSetup(merchantIdentifier: string): Promise<boolean>;
  static supportsVersion(version: number): boolean;

  oncancel: ((event: any) => void) | null;
  onpaymentauthorized: ((event: any) => void) | null;
  onpaymentmethodselected: ((event: any) => void) | null;
  onshippingcontactselected: ((event: any) => void) | null;
  onshippingmethodselected: ((event: any) => void) | null;
  onvalidatemerchant: ((event: any) => void) | null;

  abort(): void;
  begin(): void;
  completePayment(result: number): void;
  completeMerchantValidation(merchantSession: any): void;
  completePaymentMethodSelection(update: any): void;
  completeShippingContactSelection(update: any): void;
  completeShippingMethodSelection(update: any): void;
}

declare namespace ApplePayJS {
  interface Event {
    type: string;
  }

  interface ApplePayPaymentRequest {
    countryCode: string;
    currencyCode: string;
    supportedNetworks: string[];
    merchantCapabilities: string[];
    total: ApplePayLineItem;
    lineItems?: ApplePayLineItem[];
    requiredBillingContactFields?: string[];
    requiredShippingContactFields?: string[];
    billingContact?: ApplePayPaymentContact;
    shippingContact?: ApplePayPaymentContact;
    shippingMethods?: ApplePayShippingMethod[];
    shippingType?: string;
    applicationData?: string;
  }

  interface ApplePayLineItem {
    label: string;
    amount: string | number;
    type?: string;
  }

  interface ApplePayPaymentContact {
    phoneNumber?: string;
    emailAddress?: string;
    givenName?: string;
    familyName?: string;
    phoneticGivenName?: string;
    phoneticFamilyName?: string;
    addressLines?: string[];
    locality?: string;
    postalCode?: string;
    administrativeArea?: string;
    country?: string;
    countryCode?: string;
  }

  interface ApplePayShippingMethod {
    label: string;
    amount: string;
    detail?: string;
    identifier?: string;
  }

  interface ApplePayValidateMerchantEvent extends Event {
    validationURL: string;
  }

  interface ApplePayPaymentAuthorizedEvent extends Event {
    payment: ApplePayPayment;
  }

  interface ApplePayPaymentMethodSelectedEvent extends Event {
    paymentMethod: ApplePayPaymentMethod;
  }

  interface ApplePayShippingContactSelectedEvent extends Event {
    shippingContact: ApplePayPaymentContact;
  }

  interface ApplePayShippingMethodSelectedEvent extends Event {
    shippingMethod: ApplePayShippingMethod;
  }

  interface ApplePayPayment {
    token: ApplePayPaymentToken;
    billingContact?: ApplePayPaymentContact;
    shippingContact?: ApplePayPaymentContact;
  }

  interface ApplePayPaymentToken {
    paymentData: any;
    paymentMethod: ApplePayPaymentMethod;
    transactionIdentifier: string;
  }

  interface ApplePayPaymentMethod {
    displayName: string;
    network: string;
    type: string;
    paymentPass?: ApplePayPaymentPass;
  }

  interface ApplePayPaymentPass {
    primaryAccountIdentifier: string;
    primaryAccountNumberSuffix: string;
    deviceAccountIdentifier?: string;
    deviceAccountNumberSuffix?: string;
    activationState: string;
  }

  interface ApplePayPaymentMethodUpdate {
    newTotal: ApplePayLineItem;
    newLineItems?: ApplePayLineItem[];
  }

  interface ApplePayShippingContactUpdate {
    newTotal: ApplePayLineItem;
    newLineItems?: ApplePayLineItem[];
    newShippingMethods?: ApplePayShippingMethod[];
    errors?: ApplePayError[];
  }

  interface ApplePayShippingMethodUpdate {
    newTotal: ApplePayLineItem;
    newLineItems?: ApplePayLineItem[];
  }

  interface ApplePayError {
    code: string;
    contactField?: string;
    message?: string;
  }
}

export {}; 