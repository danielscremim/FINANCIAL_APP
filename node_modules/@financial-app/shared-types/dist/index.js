"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventType = exports.PurchaseCategory = void 0;
// Enums
var PurchaseCategory;
(function (PurchaseCategory) {
    PurchaseCategory["MERCADO"] = "mercado";
    PurchaseCategory["COMBUSTIVEL"] = "combustivel";
    PurchaseCategory["RESTAURANTE"] = "restaurante";
    PurchaseCategory["FARMACIA"] = "farmacia";
    PurchaseCategory["TRANSPORTE"] = "transporte";
    PurchaseCategory["ENTRETENIMENTO"] = "entretenimento";
    PurchaseCategory["VESTUARIO"] = "vestuario";
    PurchaseCategory["SAUDE"] = "saude";
    PurchaseCategory["EDUCACAO"] = "educacao";
    PurchaseCategory["CASA"] = "casa";
    PurchaseCategory["OUTROS"] = "outros";
})(PurchaseCategory || (exports.PurchaseCategory = PurchaseCategory = {}));
var EventType;
(function (EventType) {
    EventType["WHATSAPP_MESSAGE_RECEIVED"] = "whatsapp.message.received";
    EventType["MESSAGE_CLASSIFIED"] = "message.classified";
    EventType["PURCHASE_CREATED"] = "purchase.created";
    EventType["CLASSIFICATION_FAILED"] = "classification.failed";
})(EventType || (exports.EventType = EventType = {}));
