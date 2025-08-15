import { z } from 'zod';
export declare const WhatsAppWebhookSchema: z.ZodObject<{
    object: z.ZodString;
    entry: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        changes: z.ZodArray<z.ZodObject<{
            value: z.ZodObject<{
                messaging_product: z.ZodString;
                metadata: z.ZodObject<{
                    display_phone_number: z.ZodString;
                    phone_number_id: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    display_phone_number: string;
                    phone_number_id: string;
                }, {
                    display_phone_number: string;
                    phone_number_id: string;
                }>;
                contacts: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    profile: z.ZodObject<{
                        name: z.ZodString;
                    }, "strip", z.ZodTypeAny, {
                        name: string;
                    }, {
                        name: string;
                    }>;
                    wa_id: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    profile: {
                        name: string;
                    };
                    wa_id: string;
                }, {
                    profile: {
                        name: string;
                    };
                    wa_id: string;
                }>, "many">>;
                messages: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    from: z.ZodString;
                    id: z.ZodString;
                    timestamp: z.ZodString;
                    text: z.ZodOptional<z.ZodObject<{
                        body: z.ZodString;
                    }, "strip", z.ZodTypeAny, {
                        body: string;
                    }, {
                        body: string;
                    }>>;
                    type: z.ZodEnum<["text", "image", "audio", "video", "document"]>;
                }, "strip", z.ZodTypeAny, {
                    timestamp: string;
                    type: "text" | "image" | "audio" | "video" | "document";
                    id: string;
                    from: string;
                    text?: {
                        body: string;
                    } | undefined;
                }, {
                    timestamp: string;
                    type: "text" | "image" | "audio" | "video" | "document";
                    id: string;
                    from: string;
                    text?: {
                        body: string;
                    } | undefined;
                }>, "many">>;
                statuses: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    status: z.ZodEnum<["sent", "delivered", "read", "failed"]>;
                    timestamp: z.ZodString;
                    recipient_id: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    timestamp: string;
                    status: "sent" | "delivered" | "read" | "failed";
                    id: string;
                    recipient_id: string;
                }, {
                    timestamp: string;
                    status: "sent" | "delivered" | "read" | "failed";
                    id: string;
                    recipient_id: string;
                }>, "many">>;
            }, "strip", z.ZodTypeAny, {
                messaging_product: string;
                metadata: {
                    display_phone_number: string;
                    phone_number_id: string;
                };
                contacts?: {
                    profile: {
                        name: string;
                    };
                    wa_id: string;
                }[] | undefined;
                messages?: {
                    timestamp: string;
                    type: "text" | "image" | "audio" | "video" | "document";
                    id: string;
                    from: string;
                    text?: {
                        body: string;
                    } | undefined;
                }[] | undefined;
                statuses?: {
                    timestamp: string;
                    status: "sent" | "delivered" | "read" | "failed";
                    id: string;
                    recipient_id: string;
                }[] | undefined;
            }, {
                messaging_product: string;
                metadata: {
                    display_phone_number: string;
                    phone_number_id: string;
                };
                contacts?: {
                    profile: {
                        name: string;
                    };
                    wa_id: string;
                }[] | undefined;
                messages?: {
                    timestamp: string;
                    type: "text" | "image" | "audio" | "video" | "document";
                    id: string;
                    from: string;
                    text?: {
                        body: string;
                    } | undefined;
                }[] | undefined;
                statuses?: {
                    timestamp: string;
                    status: "sent" | "delivered" | "read" | "failed";
                    id: string;
                    recipient_id: string;
                }[] | undefined;
            }>;
            field: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            value: {
                messaging_product: string;
                metadata: {
                    display_phone_number: string;
                    phone_number_id: string;
                };
                contacts?: {
                    profile: {
                        name: string;
                    };
                    wa_id: string;
                }[] | undefined;
                messages?: {
                    timestamp: string;
                    type: "text" | "image" | "audio" | "video" | "document";
                    id: string;
                    from: string;
                    text?: {
                        body: string;
                    } | undefined;
                }[] | undefined;
                statuses?: {
                    timestamp: string;
                    status: "sent" | "delivered" | "read" | "failed";
                    id: string;
                    recipient_id: string;
                }[] | undefined;
            };
            field: string;
        }, {
            value: {
                messaging_product: string;
                metadata: {
                    display_phone_number: string;
                    phone_number_id: string;
                };
                contacts?: {
                    profile: {
                        name: string;
                    };
                    wa_id: string;
                }[] | undefined;
                messages?: {
                    timestamp: string;
                    type: "text" | "image" | "audio" | "video" | "document";
                    id: string;
                    from: string;
                    text?: {
                        body: string;
                    } | undefined;
                }[] | undefined;
                statuses?: {
                    timestamp: string;
                    status: "sent" | "delivered" | "read" | "failed";
                    id: string;
                    recipient_id: string;
                }[] | undefined;
            };
            field: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        id: string;
        changes: {
            value: {
                messaging_product: string;
                metadata: {
                    display_phone_number: string;
                    phone_number_id: string;
                };
                contacts?: {
                    profile: {
                        name: string;
                    };
                    wa_id: string;
                }[] | undefined;
                messages?: {
                    timestamp: string;
                    type: "text" | "image" | "audio" | "video" | "document";
                    id: string;
                    from: string;
                    text?: {
                        body: string;
                    } | undefined;
                }[] | undefined;
                statuses?: {
                    timestamp: string;
                    status: "sent" | "delivered" | "read" | "failed";
                    id: string;
                    recipient_id: string;
                }[] | undefined;
            };
            field: string;
        }[];
    }, {
        id: string;
        changes: {
            value: {
                messaging_product: string;
                metadata: {
                    display_phone_number: string;
                    phone_number_id: string;
                };
                contacts?: {
                    profile: {
                        name: string;
                    };
                    wa_id: string;
                }[] | undefined;
                messages?: {
                    timestamp: string;
                    type: "text" | "image" | "audio" | "video" | "document";
                    id: string;
                    from: string;
                    text?: {
                        body: string;
                    } | undefined;
                }[] | undefined;
                statuses?: {
                    timestamp: string;
                    status: "sent" | "delivered" | "read" | "failed";
                    id: string;
                    recipient_id: string;
                }[] | undefined;
            };
            field: string;
        }[];
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    object: string;
    entry: {
        id: string;
        changes: {
            value: {
                messaging_product: string;
                metadata: {
                    display_phone_number: string;
                    phone_number_id: string;
                };
                contacts?: {
                    profile: {
                        name: string;
                    };
                    wa_id: string;
                }[] | undefined;
                messages?: {
                    timestamp: string;
                    type: "text" | "image" | "audio" | "video" | "document";
                    id: string;
                    from: string;
                    text?: {
                        body: string;
                    } | undefined;
                }[] | undefined;
                statuses?: {
                    timestamp: string;
                    status: "sent" | "delivered" | "read" | "failed";
                    id: string;
                    recipient_id: string;
                }[] | undefined;
            };
            field: string;
        }[];
    }[];
}, {
    object: string;
    entry: {
        id: string;
        changes: {
            value: {
                messaging_product: string;
                metadata: {
                    display_phone_number: string;
                    phone_number_id: string;
                };
                contacts?: {
                    profile: {
                        name: string;
                    };
                    wa_id: string;
                }[] | undefined;
                messages?: {
                    timestamp: string;
                    type: "text" | "image" | "audio" | "video" | "document";
                    id: string;
                    from: string;
                    text?: {
                        body: string;
                    } | undefined;
                }[] | undefined;
                statuses?: {
                    timestamp: string;
                    status: "sent" | "delivered" | "read" | "failed";
                    id: string;
                    recipient_id: string;
                }[] | undefined;
            };
            field: string;
        }[];
    }[];
}>;
export declare const InternalMessageSchema: z.ZodObject<{
    id: z.ZodString;
    messageId: z.ZodString;
    from: z.ZodString;
    text: z.ZodString;
    timestamp: z.ZodDate;
    source: z.ZodLiteral<"whatsapp">;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    timestamp: Date;
    messageId: string;
    id: string;
    from: string;
    text: string;
    source: "whatsapp";
    metadata?: Record<string, any> | undefined;
}, {
    timestamp: Date;
    messageId: string;
    id: string;
    from: string;
    text: string;
    source: "whatsapp";
    metadata?: Record<string, any> | undefined;
}>;
export declare const ClassificationResultSchema: z.ZodObject<{
    messageId: z.ZodString;
    isPurchase: z.ZodBoolean;
    category: z.ZodOptional<z.ZodEnum<["mercado", "combustivel", "restaurante", "farmacia", "transporte", "entretenimento", "vestuario", "saude", "educacao", "casa", "outros"]>>;
    amount: z.ZodOptional<z.ZodNumber>;
    description: z.ZodOptional<z.ZodString>;
    confidence: z.ZodNumber;
    extractedData: z.ZodOptional<z.ZodObject<{
        merchantName: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodString>;
        paymentMethod: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        merchantName?: string | undefined;
        location?: string | undefined;
        paymentMethod?: string | undefined;
    }, {
        merchantName?: string | undefined;
        location?: string | undefined;
        paymentMethod?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    messageId: string;
    isPurchase: boolean;
    confidence: number;
    category?: "mercado" | "combustivel" | "restaurante" | "farmacia" | "transporte" | "entretenimento" | "vestuario" | "saude" | "educacao" | "casa" | "outros" | undefined;
    amount?: number | undefined;
    description?: string | undefined;
    extractedData?: {
        merchantName?: string | undefined;
        location?: string | undefined;
        paymentMethod?: string | undefined;
    } | undefined;
}, {
    messageId: string;
    isPurchase: boolean;
    confidence: number;
    category?: "mercado" | "combustivel" | "restaurante" | "farmacia" | "transporte" | "entretenimento" | "vestuario" | "saude" | "educacao" | "casa" | "outros" | undefined;
    amount?: number | undefined;
    description?: string | undefined;
    extractedData?: {
        merchantName?: string | undefined;
        location?: string | undefined;
        paymentMethod?: string | undefined;
    } | undefined;
}>;
export declare const PurchaseOrderSchema: z.ZodObject<{
    id: z.ZodString;
    messageId: z.ZodString;
    userId: z.ZodString;
    category: z.ZodEnum<["mercado", "combustivel", "restaurante", "farmacia", "transporte", "entretenimento", "vestuario", "saude", "educacao", "casa", "outros"]>;
    amount: z.ZodNumber;
    description: z.ZodString;
    merchantName: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    paymentMethod: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodDate;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    timestamp: Date;
    userId: string;
    messageId: string;
    id: string;
    category: "mercado" | "combustivel" | "restaurante" | "farmacia" | "transporte" | "entretenimento" | "vestuario" | "saude" | "educacao" | "casa" | "outros";
    amount: number;
    description: string;
    metadata?: Record<string, any> | undefined;
    merchantName?: string | undefined;
    location?: string | undefined;
    paymentMethod?: string | undefined;
}, {
    timestamp: Date;
    userId: string;
    messageId: string;
    id: string;
    category: "mercado" | "combustivel" | "restaurante" | "farmacia" | "transporte" | "entretenimento" | "vestuario" | "saude" | "educacao" | "casa" | "outros";
    amount: number;
    description: string;
    metadata?: Record<string, any> | undefined;
    merchantName?: string | undefined;
    location?: string | undefined;
    paymentMethod?: string | undefined;
}>;
export declare const ServiceConfigSchema: z.ZodObject<{
    port: z.ZodNumber;
    environment: z.ZodEnum<["development", "production", "test"]>;
    database: z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        url: string;
    }, {
        url: string;
    }>>;
    rabbitmq: z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
        queues: z.ZodRecord<z.ZodString, z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        queues: Record<string, string>;
    }, {
        url: string;
        queues: Record<string, string>;
    }>>;
    redis: z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        url: string;
    }, {
        url: string;
    }>>;
    whatsapp: z.ZodOptional<z.ZodObject<{
        verifyToken: z.ZodString;
        appSecret: z.ZodString;
        accessToken: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        verifyToken: string;
        appSecret: string;
        accessToken?: string | undefined;
    }, {
        verifyToken: string;
        appSecret: string;
        accessToken?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    port: number;
    environment: "development" | "production" | "test";
    whatsapp?: {
        verifyToken: string;
        appSecret: string;
        accessToken?: string | undefined;
    } | undefined;
    database?: {
        url: string;
    } | undefined;
    rabbitmq?: {
        url: string;
        queues: Record<string, string>;
    } | undefined;
    redis?: {
        url: string;
    } | undefined;
}, {
    port: number;
    environment: "development" | "production" | "test";
    whatsapp?: {
        verifyToken: string;
        appSecret: string;
        accessToken?: string | undefined;
    } | undefined;
    database?: {
        url: string;
    } | undefined;
    rabbitmq?: {
        url: string;
        queues: Record<string, string>;
    } | undefined;
    redis?: {
        url: string;
    } | undefined;
}>;
export declare class ValidationError extends Error {
    issues: z.ZodIssue[];
    constructor(message: string, issues: z.ZodIssue[]);
}
export declare function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T;
export declare function validate<T>(schema: z.ZodSchema<T>, data: unknown): {
    success: boolean;
    data?: T;
    errors?: z.ZodIssue[];
};
export declare function validateCurrency(value: string): number | null;
export declare function validatePhoneNumber(phone: string): boolean;
