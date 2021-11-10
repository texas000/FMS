export default function shipmentFileType(x) {
  switch (x) {
    case 10:
      return [
        { level: 10, value: "isf", label: "ISF" },
        { level: 10, value: "hbl", label: "House B/L" },
        { level: 10, value: "packing", label: "Packing List" },
        { level: 10, value: "invoice", label: "Commercial Invoice" },
        { level: 10, value: "customs", label: "Customs Document" },
        { level: 10, value: "pod", label: "Proof of Delivery" },
        { level: 10, value: "quote", label: "Quotation" },
        { level: 10, value: "others", label: "Others" },
      ];
    case 20:
      return [
        { level: 20, value: "debit", label: "Debit Note" },
        { level: 20, value: "credit", label: "Credit Note" },
        { level: 20, value: "others", label: "Others" },
      ];
    case 30:
      return [
        { level: 30, value: "vinvoice", label: "Vendor Invoice" },
        { level: 30, value: "mbl", label: "Master B/L" },
        { level: 30, value: "truck", label: "Trucking Invoice" },
        { level: 30, value: "do", label: "Delivery Order" },
        { level: 30, value: "an", label: "Carrier Arrival Notice" },
        { level: 30, value: "cinvoice", label: "Customs Invoice" },
        { level: 30, value: "others", label: "Others" },
      ];
    default:
      return [];
  }
}
