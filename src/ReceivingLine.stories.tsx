import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import ReceivingLine, { ReceivingHead } from "./ReceivingLine";

// Lines from PO-00058 (Manion's), the PO the receiving mockup was drawn from.
const meta = {
  title: "Patterns/ReceivingLine",
  component: ReceivingLine,
  parameters: { layout: "fullscreen" },
  args: {
    n: 3,
    item: 'QE 24" Trim Coil 50\' Woodgrain',
    code: "QETCW24T",
    maker: "Quality Edge",
    color: "Woodgrain",
    ordered: 1,
    received: 0,
    remaining: 1,
    unit: "EA",
    onOpen: fn(),
    onReceive: fn(),
    onPhoto: fn(),
  },
  decorators: [(S) => <div className="ui-rows"><S /></div>],
} satisfies Meta<typeof ReceivingLine>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};
export const Short: Story = {
  args: { n: 1, item: "QE Center Vent 12' - 16\" Terratone #511", code: "QESCVT", color: "Terratone", ordered: 44, received: 12, remaining: 32 },
};
export const Received: Story = {
  args: { n: 2, item: 'QE 6" Fascia 12\' Terratone Woodgrain', code: "QE6WFT", color: "Terratone Woodgrain", ordered: 40, received: 40, remaining: 0 },
};
export const WithPhotos: Story = { args: { photos: 2 } };
export const NoMakerOrColor: Story = { args: { n: 7, item: "Trim Nail 1Lb", code: "QETNT", maker: undefined, color: undefined, ordered: 2, unit: "box" } };
export const LongName: Story = {
  args: {
    n: 8,
    item: "BLOCK-IT House Wrap 9' x 100' with printed lap lines, the long name wraps to two lines",
    code: "KCBI9100",
    maker: "Kingspan",
    ordered: 10,
    unit: "box",
  },
};

const po = [
  { n: 1, item: "QE Center Vent 12' - 16\" Terratone #511", code: "QESCVT", maker: "Quality Edge", color: "Terratone", ordered: 44, received: 12, unit: "EA" },
  { n: 2, item: 'QE 6" Fascia 12\' Terratone Woodgrain', code: "QE6WFT", maker: "Quality Edge", color: "Terratone Woodgrain", ordered: 40, received: 40, unit: "EA" },
  { n: 3, item: 'QE 24" Trim Coil 50\' Woodgrain', code: "QETCW24T", maker: "Quality Edge", color: "Woodgrain", ordered: 1, received: 0, unit: "EA" },
  { n: 4, item: "QE Solid Soffit 12' - 16\"", code: "QESST", maker: "Quality Edge", color: "White", ordered: 3, received: 0, unit: "EA" },
  { n: 5, item: "QE Frieze Channel", code: "QEF38T", maker: "Quality Edge", color: "Terratone", ordered: 45, received: 0, unit: "EA" },
  { n: 7, item: "Trim Nail 1Lb", code: "QETNT", ordered: 2, received: 0, unit: "box" },
];

function Po({ columns }: { columns?: boolean }) {
  const [got, setGot] = useState<Record<number, number>>(Object.fromEntries(po.map((l) => [l.n, l.received])));
  const [shots, setShots] = useState<Record<number, number>>({ 1: 1 });
  return (
    <>
      {columns ? <ReceivingHead /> : null}
      {po.map((l) => (
        <ReceivingLine
          key={l.n}
          {...l}
          received={got[l.n]}
          remaining={l.ordered - got[l.n]}
          photos={shots[l.n] ?? 0}
          columns={columns}
          onReceive={() => setGot({ ...got, [l.n]: l.ordered })}
          onPhoto={() => setShots({ ...shots, [l.n]: (shots[l.n] ?? 0) + 1 })}
        />
      ))}
    </>
  );
}

export const PhoneList: StoryObj = { render: () => <Po /> };
export const DeskTable: StoryObj = { render: () => <Po columns /> };
