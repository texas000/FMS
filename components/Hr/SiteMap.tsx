import { Tree, ITreeNode, Icon } from "@blueprintjs/core";
import { ContextMenu2, Tooltip2 } from "@blueprintjs/popover2";
import React from "react";

const Level1 = () => (
  <Tooltip2 content="STATUS LEVEL 1">
    <Icon icon="blocked-person" intent="primary" />
  </Tooltip2>
);

const Level5 = () => (
  <Tooltip2 content="STATUS LEVEL 5">
    <Icon icon="blocked-person" intent="success" />
  </Tooltip2>
);

const Level9 = () => (
  <Tooltip2 content="STATUS LEVEL 9">
    <Icon icon="blocked-person" intent="danger" />
  </Tooltip2>
);

const nodes: ITreeNode[] = [
  {
    id: 0,
    hasCaret: true,
    isExpanded: true,
    icon: "folder-close",
    label: (
      <ContextMenu2 content={<div>Dashboard</div>}>Dashboard</ContextMenu2>
    ),
    childNodes: [
      {
        id: 1,
        icon: "document",
        label: "Dashboard",
        secondaryLabel: <Level1 />,
      },
    ],
  },
  {
    id: 1,
    hasCaret: true,
    isExpanded: true,
    icon: "folder-close",
    label: (
      <ContextMenu2 content={<div>Forwarding</div>}>Forwarding</ContextMenu2>
    ),
    childNodes: [
      {
        id: 2,
        icon: "document",
        label: "Oim",
        secondaryLabel: <Level1 />,
      },
      {
        id: 3,
        icon: "document",
        label: "Oex",
        secondaryLabel: <Level1 />,
      },
      {
        id: 4,
        icon: "document",
        label: "Aim",
        secondaryLabel: <Level1 />,
      },
      {
        id: 5,
        icon: "document",
        label: "Aex",
        secondaryLabel: <Level1 />,
      },
      {
        id: 6,
        icon: "document",
        label: "Other",
        secondaryLabel: <Level1 />,
      },
      {
        id: 7,
        icon: "document",
        label: "Trucking",
        secondaryLabel: <Level5 />,
      },
    ],
  },
  {
    id: 2,
    hasCaret: true,
    isExpanded: true,
    icon: "folder-close",
    label: <ContextMenu2 content={<div>Company</div>}>Company</ContextMenu2>,
    childNodes: [
      {
        id: 8,
        icon: "document",
        label: "Company",
        secondaryLabel: <Level1 />,
      },
    ],
  },
  {
    id: 3,
    hasCaret: true,
    isExpanded: true,
    icon: "folder-close",
    label: <ContextMenu2 content={<div>Board</div>}>Board</ContextMenu2>,
    childNodes: [
      {
        id: 9,
        icon: "document",
        label: "Board",
        secondaryLabel: <Level1 />,
      },
    ],
  },
  {
    id: 4,
    hasCaret: true,
    isExpanded: true,
    icon: "folder-close",
    label: <ContextMenu2 content={<div>PO</div>}>Purchase Order</ContextMenu2>,
    childNodes: [
      {
        id: 10,
        icon: "document",
        label: "PO",
        secondaryLabel: <Level1 />,
      },
    ],
  },
];

const admin: ITreeNode[] = [
  {
    id: 0,
    hasCaret: true,
    isExpanded: true,
    icon: "folder-close",
    label: (
      <ContextMenu2 content={<div>Dashboard</div>}>Human Resource</ContextMenu2>
    ),
    childNodes: [
      {
        id: 1,
        icon: "document",
        label: "Hr",
        secondaryLabel: <Level9 />,
      },
    ],
  },
  {
    id: 1,
    hasCaret: true,
    isExpanded: true,
    icon: "folder-close",
    label: (
      <ContextMenu2 content={<div>Dashboard</div>}>Statistic</ContextMenu2>
    ),
    childNodes: [
      {
        id: 2,
        icon: "document",
        label: "Statistic",
        secondaryLabel: (
          <div className="d-flex flex-row">
            <Level5 />
            <Level9 />
          </div>
        ),
      },
    ],
  },
];

export const SiteMap = () => {
  return (
    <div className="row my-3">
      <div className="col-md-6">
        <h2>User Level</h2>
        <Tree contents={nodes}></Tree>
      </div>
      <div className="col-md-6">
        <h2>Admin Level</h2>
        <Tree contents={admin}></Tree>
      </div>
    </div>
  );
};
export default SiteMap;
