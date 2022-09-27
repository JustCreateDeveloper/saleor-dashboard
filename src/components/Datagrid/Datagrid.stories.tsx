import { GridCell, Item } from "@glideapps/glide-data-grid";
import { Button } from "@saleor/macaw-ui";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { booleanCell, moneyCell, numberCell, textCell } from "./cells";
import Datagrid, { GetCellContentOpts } from "./Datagrid";
import { initialData } from "./fixtures";
import { numberCellEmptyValue } from "./NumberCell";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "./useDatagridChange";

const availableColumns = [
  { title: "ID", id: "uuid", width: 300 },
  { title: "Loaned", id: "loan-active", width: 70 },
  { title: "Loaned Amount", id: "loan", width: 200 },
  { title: "Name", id: "name", width: 200 },
  { title: "Balance", id: "balance", width: 200 },
  { title: "Eye color", id: "eyeColor", width: 200 },
  { title: "Age", id: "age", width: 80 },
] as const;

const DefaultStory: React.FC<{ error?: boolean }> = ({ error }) => {
  const changeProps = useDatagridChangeState();
  const getCellContent = React.useCallback(
    (
      [column, row]: Item,
      { changes, getChangeIndex, added, removed }: GetCellContentOpts,
    ): GridCell => {
      const columnId = availableColumns[column].id;
      const change = changes.current[getChangeIndex(columnId, row)]?.data;
      const dataRow = added.includes(row)
        ? undefined
        : initialData[row + removed.filter(r => r <= row).length];

      const styled = (props: GridCell) => ({
        ...props,
        themeOverride:
          change !== undefined
            ? {
                bgCell: "#C1DBFF",
              }
            : {},
      });

      if (columnId === "loan-active") {
        return styled(booleanCell(change ?? dataRow?.loan.active ?? null));
      }

      if (columnId === "loan") {
        return styled(
          moneyCell(
            change?.value ?? dataRow?.loan.amount ?? null,
            dataRow?.loan.currency ?? "USD",
          ),
        );
      }

      if (columnId === "balance") {
        return styled(
          numberCell(change ?? dataRow?.balance ?? numberCellEmptyValue),
        );
      }

      if (columnId === "age") {
        return styled(
          numberCell(change?.value ?? dataRow?.age ?? numberCellEmptyValue),
        );
      }

      const data = change ?? (dataRow ? dataRow[columnId] : "");
      return styled(textCell(data));
    },
    [],
  );

  const getCellError = React.useCallback(([column, row]: Item): boolean => {
    if (!error) {
      return false;
    }
    const columnId = availableColumns[column].id;

    return row === 3 && columnId === "uuid";
  }, []);

  return (
    <DatagridChangeStateContext.Provider value={changeProps}>
      <div style={{ width: 800, margin: "auto" }}>
        <Datagrid
          addButtonLabel="Add row"
          availableColumns={availableColumns}
          getCellContent={getCellContent}
          getCellError={getCellError}
          menuItems={() => [
            {
              label: "Do something",
              onSelect: () => undefined,
            },
          ]}
          selectionActions={selection => (
            <Button
              variant="tertiary"
              onClick={() =>
                // eslint-disable-next-line no-console
                console.log(selection.map(index => initialData[index]))
              }
            >
              Action 1
            </Button>
          )}
          rows={initialData.length}
        />
      </div>
    </DatagridChangeStateContext.Provider>
  );
};

storiesOf("Generics / Datagrid", module)
  .addDecorator(Decorator)
  .add("default", () => <DefaultStory />)
  .add("with errors", () => <DefaultStory error />);
