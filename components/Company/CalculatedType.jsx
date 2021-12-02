export default function CalculatedType({ count }) {
  if (count && (count.AP || count.INV || count.CR)) {
    if (count.AP > Math.max(count.INV, count.CR)) {
      return (
        <span className="bg-indigo-500 rounded-full text-white p-1">
          VENDOR
        </span>
      );
    }
    if (count.CR >= Math.max(count.AP, count.INV)) {
      return (
        <span className="bg-indigo-500 rounded-full text-white p-1">AGENT</span>
      );
    }
    if (count.INV >= Math.max(count.AP, count.CR)) {
      return (
        <span className="bg-indigo-500 rounded-full text-white p-1">
          CUSTOMER
        </span>
      );
    }
  } else {
    return (
      <span className="bg-red-500 rounded-full text-white p-1">NO HISTORY</span>
    );
  }
}
