"use client";

// Every part in cc-ui/parts in each of its states, on fixture words only. Mounted by an app at a review route
// (cc-app /ui on a branch) so a change to a part is seen at 390 and 1440 before it ships.

import { useState, type ReactNode } from "react";
import type { Key, SortDescriptor } from "react-aria-components";
import Button from "../src/Button";
import {
  ButtonGroup,
  ButtonGroupItem,
  Checkbox,
  CheckboxGroup,
  ComboBox,
  Disclosure,
  ListItem,
  ListSection,
  Modal,
  ModalTrigger,
  MultiSelect,
  Panel,
  ProgressBar,
  SearchField,
  Section,
  SectionRow,
  Segmented,
  Switch,
  Table,
  TabItem,
  TabList,
  TabPanel,
  Tabs,
  TagGroup,
  TagItem,
  Tooltip,
  TooltipTrigger,
} from "../src/parts";

const trades = [
  { id: "roof", label: "Roofing" },
  { id: "siding", label: "Siding" },
  { id: "gutters", label: "Gutters" },
  { id: "windows", label: "Windows" },
  { id: "soffit", label: "Soffit and fascia" },
  { id: "insulation", label: "Insulation" },
  { id: "doors", label: "Doors" },
  { id: "decks", label: "Decks" },
  { id: "paint", label: "Painting" },
  { id: "chimney", label: "Chimney flashing and cap" },
];

const colors = [
  { id: "white", name: "White" },
  { id: "almond", name: "Almond" },
  { id: "clay", name: "Clay" },
  { id: "musket", name: "Musket Brown" },
  { id: "black", name: "Black" },
  { id: "charcoal", name: "Charcoal Gray" },
];

type Line = { id: string; item: string; qty: number; unit: string; price: number; trade: string };
const lines: Line[] = [
  { id: "1", item: "Architectural shingles, Charcoal", qty: 32, unit: "bundles", price: 1184, trade: "Roofing" },
  { id: "2", item: "Synthetic underlayment, 10 square roll", qty: 4, unit: "rolls", price: 412, trade: "Roofing" },
  { id: "3", item: "6 inch K-style gutter, White", qty: 140, unit: "feet", price: 896, trade: "Gutters" },
  { id: "4", item: "3 by 4 downspout, White", qty: 60, unit: "feet", price: 318, trade: "Gutters" },
  { id: "5", item: "Ridge vent with an external baffle, the long name wraps instead of cutting off", qty: 9, unit: "pieces", price: 207, trade: "Roofing" },
];

const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="flex flex-col gap-4 border-b border-solid border-cc-line px-4 py-6 desk:px-6">
      <h2 id={`${id}-h`} className="m-0 text-cc-title font-semibold text-cc-text">
        {title}
      </h2>
      {children}
    </section>
  );
}

function States({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 desk:grid-cols-2 wide:grid-cols-3">{children}</div>;
}

export default function Gallery() {
  const [picked, setPicked] = useState<Key[]>(["roof", "gutters"]);
  const [many, setMany] = useState<Key[]>(trades.map((t) => t.id).slice(0, 7));
  const [view, setView] = useState<Key>("open");
  const [sort, setSort] = useState<SortDescriptor>({ column: "item", direction: "ascending" });
  const [modal, setModal] = useState(false);
  const [tags, setTags] = useState(["Roofing", "Gutters", "Siding"]);

  const sorted = [...lines].sort((a, b) => {
    const k = sort.column as keyof Line;
    const d = a[k] < b[k] ? -1 : a[k] > b[k] ? 1 : 0;
    return sort.direction === "descending" ? -d : d;
  });

  return (
    <main className="mx-auto flex max-w-6xl flex-col bg-cc-bg pb-24 text-cc-text">
      <header className="border-b border-solid border-cc-line px-4 py-6 desk:px-6">
        <h1 className="m-0 text-cc-page font-strong">cc-ui parts</h1>
      </header>

      <Block id="multiselect" title="MultiSelect">
        <States>
          <MultiSelect label="Trades" options={trades} value={picked} onChange={setPicked} />
          <MultiSelect label="Trades, many picked" options={trades} value={many} onChange={setMany} />
          <MultiSelect label="Trades, none picked" options={trades} value={[]} onChange={() => {}} />
          <MultiSelect label="Trades, disabled" options={trades} value={["roof"]} onChange={() => {}} isDisabled />
          <MultiSelect label="Trades, error" options={trades} value={[]} onChange={() => {}} errorMessage="Pick at least one trade" />
        </States>
      </Block>

      <Block id="combobox" title="ComboBox">
        <States>
          <ComboBox label="Gutter color" items={colors} placeholder="Type a color">
            {(c) => <ListItem id={c.id}>{c.name}</ListItem>}
          </ComboBox>
          <ComboBox label="Gutter color, picked" items={colors} defaultSelectedKey="musket">
            {(c) => <ListItem id={c.id}>{c.name}</ListItem>}
          </ComboBox>
          <ComboBox label="Gutter color, disabled" items={colors} defaultSelectedKey="white" isDisabled>
            {(c) => <ListItem id={c.id}>{c.name}</ListItem>}
          </ComboBox>
          <ComboBox label="Gutter color, error" items={colors} isInvalid errorMessage="Pick a color from the list">
            {(c) => <ListItem id={c.id}>{c.name}</ListItem>}
          </ComboBox>
          <ComboBox label="Grouped">
            <ListSection title="Light">
              <ListItem id="white">White</ListItem>
              <ListItem id="almond">Almond</ListItem>
            </ListSection>
            <ListSection title="Dark">
              <ListItem id="musket">Musket Brown</ListItem>
              <ListItem id="black">Black</ListItem>
            </ListSection>
          </ComboBox>
        </States>
      </Block>

      <Block id="table" title="Table">
        <Table<Line>
          aria-label="Material lines"
          columns={[
            { id: "item", label: "Item", isRowHeader: true, allowsSorting: true },
            { id: "trade", label: "Trade", allowsSorting: true },
            { id: "qty", label: "Quantity", align: "end", allowsSorting: true, render: (r) => `${r.qty} ${r.unit}` },
            { id: "price", label: "Price", align: "end", allowsSorting: true, render: (r) => money(r.price) },
          ]}
          rows={sorted}
          sortDescriptor={sort}
          onSortChange={setSort}
          onRowAction={() => {}}
        />
        <Table<Line>
          aria-label="Empty lines"
          columns={[
            { id: "item", label: "Item", isRowHeader: true },
            { id: "price", label: "Price", align: "end" },
          ]}
          rows={[]}
          emptyText="No material lines"
        />
      </Block>

      <Block id="modal" title="Modal">
        <div className="flex flex-wrap gap-2">
          <ModalTrigger>
            <Button variant="secondary">Open a modal</Button>
            <Modal
              title="Mark the job ready"
              actions={(close) => (
                <>
                  <Button variant="secondary" onClick={close}>
                    Cancel
                  </Button>
                  <Button onClick={close}>Mark ready</Button>
                </>
              )}
            >
              <p className="m-0">Test Developer Job moves to the Ready to start list.</p>
            </Modal>
          </ModalTrigger>
          <Button variant="secondary" onClick={() => setModal(true)}>
            Open a long modal
          </Button>
          <Modal title="Every trade on the job" isOpen={modal} onOpenChange={setModal} size="lg" actions={<Button onClick={() => setModal(false)}>Done</Button>}>
            <CheckboxGroup label="Trades" defaultValue={["roof"]}>
              {trades.map((t) => (
                <Checkbox key={t.id} value={t.id}>
                  {t.label}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </Modal>
        </div>
      </Block>

      <Block id="buttongroup" title="ButtonGroup and Segmented">
        <States>
          <Segmented
            label="Tasks"
            value={view}
            onChange={setView}
            options={[
              { id: "open", label: "Incomplete" },
              { id: "done", label: "Completed" },
            ]}
          />
          <ButtonGroup aria-label="Zoom" selectionMode="single" defaultSelectedKeys={["week"]}>
            <ButtonGroupItem id="day">Day</ButtonGroupItem>
            <ButtonGroupItem id="week">Week</ButtonGroupItem>
            <ButtonGroupItem id="month">Month</ButtonGroupItem>
          </ButtonGroup>
          <ButtonGroup aria-label="Filters" selectionMode="multiple" defaultSelectedKeys={["roof"]}>
            <ButtonGroupItem id="roof">Roofing</ButtonGroupItem>
            <ButtonGroupItem id="gutters">Gutters</ButtonGroupItem>
            <ButtonGroupItem id="siding" isDisabled>
              Siding
            </ButtonGroupItem>
          </ButtonGroup>
        </States>
      </Block>

      <Block id="tabs" title="Tabs">
        <Tabs defaultSelectedKey="list">
          <TabList aria-label="View">
            <TabItem id="list">List</TabItem>
            <TabItem id="calendar">Calendar</TabItem>
            <TabItem id="files" isDisabled>
              Files
            </TabItem>
          </TabList>
          <TabPanel id="list">Every open task, newest first.</TabPanel>
          <TabPanel id="calendar">Tasks by the day they are due.</TabPanel>
          <TabPanel id="files">Files</TabPanel>
        </Tabs>
      </Block>

      <Block id="fields" title="Checkbox, Switch, SearchField, TagGroup">
        <States>
          <CheckboxGroup label="Before covering" defaultValue={["deck"]}>
            <Checkbox value="deck">Deck photographed</Checkbox>
            <Checkbox value="flash">Flashing photographed</Checkbox>
            <Checkbox value="vent" isDisabled>
              Vents photographed
            </Checkbox>
          </CheckboxGroup>
          <div className="flex flex-col">
            <Checkbox isIndeterminate>Some trades done</Checkbox>
            <Checkbox isInvalid>Signed contract on file</Checkbox>
            <Switch defaultSelected>Notifications</Switch>
            <Switch>Text me too</Switch>
            <Switch isDisabled>Email the crew</Switch>
          </div>
          <div className="flex flex-col gap-4">
            <SearchField label="Search jobs" placeholder="Name or job number" />
            <SearchField label="Search jobs, filled" defaultValue="22-1215" />
          </div>
          <TagGroup label="Trades on the job" onRemove={(keys) => setTags(tags.filter((t) => !keys.has(t)))} emptyText="No trades">
            {tags.map((t) => (
              <TagItem key={t} id={t}>
                {t}
              </TagItem>
            ))}
          </TagGroup>
          <TagGroup label="Pick a filter" selectionMode="single" defaultSelectedKeys={["late"]}>
            <TagItem id="late">Late</TagItem>
            <TagItem id="today">Today</TagItem>
            <TagItem id="week">This week</TagItem>
          </TagGroup>
        </States>
      </Block>

      <Block id="section" title="Section and Panel">
        <States>
          <Section title="Downspouts" count={3} action={<Button variant="text">Add downspout</Button>}>
            <SectionRow label="Front left" detail="3 by 4, White" end="18 ft" />
            <SectionRow label="Front right" detail="3 by 4, White" end="18 ft" />
            <SectionRow label="Back corner by the garage, a long place name that wraps" detail="2 by 3, White" end="11 ft" />
          </Section>
          <Section title="Open questions" count={0}>
            <SectionRow label="None" />
          </Section>
          <Panel title="Job" action={<Button variant="text">Edit</Button>}>
            <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-cc-body">
              <dt className="text-cc-meta text-cc-muted">Job</dt>
              <dd className="m-0">22-1215 Test Developer Job</dd>
              <dt className="text-cc-meta text-cc-muted">Status</dt>
              <dd className="m-0">Ready to start</dd>
            </dl>
          </Panel>
        </States>
      </Block>

      <Block id="more" title="Disclosure, ProgressBar, Tooltip">
        <States>
          <div>
            <Disclosure title="Job history" defaultExpanded>
              Sold, then measured, then scheduled.
            </Disclosure>
            <Disclosure title="Rarely used fields">Permit number and lot.</Disclosure>
          </div>
          <div className="flex flex-col gap-4">
            <ProgressBar label="Steps done" value={5} maxValue={8} valueLabel="5 of 8" />
            <ProgressBar label="Loading the roof report" isIndeterminate />
          </div>
          <TooltipTrigger>
            <Button variant="secondary" aria-label="Print">
              Print
            </Button>
            <Tooltip>Print the job packet</Tooltip>
          </TooltipTrigger>
        </States>
      </Block>
    </main>
  );
}
