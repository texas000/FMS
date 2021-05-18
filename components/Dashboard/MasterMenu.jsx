import { Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import { useRouter } from "next/router";

export const MasterMenu = ({ data, type }) => {
  const router = useRouter();
  return (
    <Menu>
      <MenuDivider
        title={data.F_U1ID[0]}
        className="text-uppercase"
      ></MenuDivider>
      <MenuDivider title="Open"></MenuDivider>
      <MenuItem
        text={data.F_RefNo}
        icon="link"
        onClick={() => router.push(`/forwarding/${type}/${data.F_RefNo}`)}
      ></MenuItem>
      <MenuItem
        text={data.F_RefNo}
        icon="share"
        target="__blank"
        onClick={() => window.open(`/forwarding/${type}/${data.F_RefNo}`)}
      ></MenuItem>
      <MenuItem
        text={data.Customer || "NO CUSTOMER"}
        icon="link"
        disabled={!data.F_Customer}
        onClick={() => router.push(`/company/${data.F_Customer}`)}
      />
      <MenuItem
        text={data.Customer || "NO CUSTOMER"}
        icon="share"
        disabled={!data.F_Customer}
        target="__blank"
        onClick={() => window.open(`/company/${data.F_Customer}`)}
      />
      <MenuDivider title="Vendor" />
      <MenuItem
        text="Agent"
        icon="share"
        disabled={!(data.F_Agent[0] || data.F_Agent)}
        target="__blank"
        onClick={() =>
          window.open(`/company/${data.F_Agent[0] || data.F_Agent}`)
        }
      />
      <MenuItem
        text="Consignee"
        icon="share"
        disabled={!data.F_Consignee}
        target="__blank"
        onClick={() =>
          window.open(
            `/company/${
              data.F_Consignee &&
              (typeof data.F_Consignee === "number"
                ? data.F_Consignee
                : data.F_Consignee[0] || data.F_Consignee[1])
            }`
          )
        }
      />
      <MenuItem
        text="Notify"
        icon="share"
        disabled={!data.F_Notify}
        target="__blank"
        onClick={() =>
          window.open(
            `/company/${
              data.F_Notify &&
              (typeof data.F_Notify === "number"
                ? data.F_Notify
                : data.F_Notify[0] || data.F_Notify[1])
            }`
          )
        }
      />
      <MenuItem
        text="Shipper"
        icon="share"
        disabled={!data.F_Shipper}
        target="__blank"
        onClick={() =>
          window.open(
            `/company/${
              data.F_Shipper &&
              (typeof data.F_Shipper === "number"
                ? data.F_Shipper
                : data.F_Shipper[0] || data.F_Shipper[1])
            }`
          )
        }
      />
      <MenuItem
        text="Bill Party"
        icon="share"
        disabled={!data.F_INVOICETO}
        target="__blank"
        href={`/company/${data.F_INVOICETO}`}
      />
    </Menu>
  );
};

export default MasterMenu;
