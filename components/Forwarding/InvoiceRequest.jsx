import { Classes, Dialog, Button, Checkbox } from "@blueprintjs/core";

export default function InvoiceRequest({ selectedInvoice }) {
  // Fecth Invoice Requested
  return (
    <Dialog
      isOpen={selectedInvoice}
      title="Request Invoice Approval"
      className="dark:bg-gray-600 w-50"
    >
      <div className={Classes.DIALOG_BODY}></div>
    </Dialog>
  );
}
